"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Home
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/video" className="hover:underline">
              Video
            </Link>
          </li>
          <li>
            <Link href="/register" className="hover:underline">
              Registration
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
