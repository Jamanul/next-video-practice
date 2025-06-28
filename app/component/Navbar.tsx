"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const session = useSession()
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Home
        </Link>
        <ul className="flex space-x-6">
          <li>
            {
              session?.data?.user.email
            }
          </li>
          <li>
            <Link href="/video" className="hover:underline">
              Video
            </Link>
          </li>
          <li>
            <Link href="/upload" className="hover:underline">
              Upload
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
