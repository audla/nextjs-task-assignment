import Link from "next/link";

export default function StyledLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-white dark:text-black hover:scale-110 hover:underline rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-medium">
            {children}
        </Link>
    )
}