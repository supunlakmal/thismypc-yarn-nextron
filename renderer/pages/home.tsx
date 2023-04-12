// renderer/pages/index.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Hello, Nextron!</h1>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  );
}
