# Reading: common API security risks (OWASP)

## Objectives

- Identify three common risks for this course's API in described endpoints: broken object level authorization (API1), broken authentication (API2) and broken function level authorization (API5) from the OWASP API Security Top 10 2023; the full list is optional reference
- Identify broken object level authorization in a described endpoint and the ownership check that fixes it
- Connect earlier course practices (validation, DTOs, error bodies without internals, password hashing, role checks) to the risks they reduce

## Teaching

`GET /orders/1042` returns any order to any logged-in user. The handler checks only that the caller has a valid token. A user changes the number in the URL, and sees someone else's order.

The OWASP API Security Top 10 2023 lists common API risks. For this course, focus on three:

| Id | Risk | Example |
| --- | --- | --- |
| API1 | Broken Object Level Authorization | Reading another user's order by id |
| API2 | Broken Authentication | Tokens with no expiry, or weak login |
| API5 | Broken Function Level Authorization | A normal user calling an admin endpoint |

Object level asks "this record, for this user?". Function level asks "this action, for this role?".

A role check does not fix object-level access: both users have the same role. Compare the owner with the caller, in the service or the query:

```
Invoice i = invoices.findByIdAndCustomer(id, customer)
    .orElseThrow(() -> new InvoiceNotFound(id));
```

A 404 also hides that the record exists. Earlier practices help too: validation limits bad input; DTOs stop mass assignment and leaks; safe errors reveal less; hashing and role checks protect login and actions.

A team has added `hasRole("USER")` to `GET /orders/**` and believes this closes the order-reading issue.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- API1, API2 and API5 are three risks to watch in this API.
- Object level checks need the record and the caller; a role check is not enough.
- Validation, DTOs, safe errors, hashing and role checks each reduce a risk.

## Cheat sheet

A hotel key should open only your own room, and an ordinary guest should not walk into the manager's office.

Your room is an object-level rule; the office is a function-level rule.

Where to act: Use the two questions in the teaching panel.

Next step: Is the failing check about this record, this action, or who the caller is?

Where to act: Change the repository call.

Next step: A plain id lookup returns anyone's order. Which method also takes the caller?

Printed alternative: Use findByIdAndOwner with the id and owner, and keep raising OrderNotFound when nothing matches. Starter file: `OrderService.java`.

- API1: BOLA, API2: Broken Authentication, API5: BFLA.
- Full list: OWASP API Security Top 10 2023 (optional reference).

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://api-security.owasp.org/
- https://api-security.owasp.org/editions/2023/en/0x11-t10/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. This is broken object level authorization (API1), the top risk on the OWASP API list.
- **B. Not this one:** The token is valid. The check that it does not make is the problem.
- **C. Not this one:** Rate limits slow scraping, but one request here already leaks data.
- **D. Not this one:** HTTPS protects the transport. The user is authorized by no rule here.

### drag

**Answer and reason for each row**

- **Changing `/invoices/77` to `/invoices/78` shows another customer's invoice: API1 Object Level.** This record belongs to someone else.
- **A JWT is accepted years after issue, because expiry is not checked: API2 Authentication.** The identity proof itself is broken.
- **A normal user calls `DELETE /admin/users/9` and it works: API5 Function Level.** This needs an admin role.

### terminal

**Printed alternative:** Use findByIdAndOwner with the id and owner, and keep raising OrderNotFound when nothing matches. Starter file: `OrderService.java`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. A role check answers the function question, not the object question.
- **B. Not this one:** A role says nothing about which records they own.
- **C. Not this one:** Token lifetime does not change which orders a valid user can read.
- **D. Not this one:** It is not deprecated. It just does not answer this question.
