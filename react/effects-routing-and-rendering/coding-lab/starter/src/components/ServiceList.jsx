import ServiceCard from "./ServiceCard.jsx";
import { recordRender } from "../render-count.js";

// Given: renders whatever list of services it receives. The recordRender
// call counts its renders (see src/render-count.js).
export default function ServiceList({ services }) {
  recordRender("ServiceList");
  return (
    <ul className="card-grid">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </ul>
  );
}
