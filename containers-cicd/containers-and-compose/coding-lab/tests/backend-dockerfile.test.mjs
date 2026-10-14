import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dockerfile, copyFrom, copyArgs } from './lab.mjs';

const stages = () => dockerfile('backend/Dockerfile');

test('backend Dockerfile has a named JDK build stage and a JRE runtime stage', () => {
  const s = stages();
  assert.ok(s.length >= 2, 'backend/Dockerfile needs two stages: a JDK build stage and a JRE runtime stage');
  assert.ok(s[0].name, 'name the build stage, for example FROM eclipse-temurin:25-jdk AS build');
  assert.ok(/jdk/.test(s[0].image), 'the build stage must start FROM a JDK image, such as eclipse-temurin:25-jdk');
  assert.ok(/jre/.test(s.at(-1).image) && !/jdk/.test(s.at(-1).image), 'the last stage must start FROM a JRE image, such as eclipse-temurin:25-jre');
});

test('backend Dockerfile copies pom.xml and downloads dependencies before copying src', () => {
  const steps = stages()[0]?.steps ?? [];
  const pom = steps.findIndex((x) => x.op === 'COPY' && /\bpom\.xml\b/.test(x.args));
  const src = steps.findIndex((x) => x.op === 'COPY' && /(^|\s)\.?\/?src\b/.test(x.args));
  const between = steps.slice(pom + 1, src).some((x) => x.op === 'RUN' && /mvnw?\b/.test(x.args));
  assert.ok(pom >= 0 && src > pom && between, 'in the build stage, COPY pom.xml, RUN the Maven wrapper to fetch dependencies, then COPY src');
});

test('backend runtime stage copies only the jar from the build stage', () => {
  const s = stages();
  const last = s.at(-1);
  const copies = last?.steps.filter((x) => x.op === 'COPY' || x.op === 'ADD') ?? [];
  const ok = s.length >= 2 && copies.length > 0 && copies.every((x) => copyFrom(x) === s[0].name && /\.jar$/.test(copyArgs(x)[1] ?? ''));
  assert.ok(ok, 'the runtime stage must copy only the jar, with COPY --from=<build stage> .../target/*.jar app.jar');
});

test('backend runtime stage starts the jar with ENTRYPOINT or CMD', () => {
  const last = stages().at(-1);
  const start = last?.steps.find((x) => (x.op === 'ENTRYPOINT' || x.op === 'CMD') && /java/.test(x.args) && /-jar/.test(x.args));
  assert.ok(start, 'start the jar in the runtime stage, for example ENTRYPOINT ["java", "-jar", "app.jar"]');
});
