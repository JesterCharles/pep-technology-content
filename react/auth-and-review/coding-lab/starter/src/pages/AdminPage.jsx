import { useAuth } from "../auth/AuthContext.jsx";

/*
TASK 4 (part 2). The admin tools render for every signed-in user. Guard the
screen by role: when the signed-in user is not an admin, render the heading
"Not allowed" and the paragraph below instead of the tools. (The link to this
page is hidden for non-admins in TASK 4 part 1, but anyone can type the URL -
the screen itself must check too, and the server checks regardless.)
*/
export default function AdminPage() {
  const { user } = useAuth();

  return (
    <>
      <h2>Admin tools</h2>
      <p>Maintenance windows, escalation policies and access reviews.</p>
    </>
  );
}

export function NotAllowedNotice() {
  return (
    <>
      <h2>Not allowed</h2>
      <p>Your account does not have the admin role this page needs.</p>
    </>
  );
}
