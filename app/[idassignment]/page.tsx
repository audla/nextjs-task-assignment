import StyledLink from "@/components/StyledLink"

export default async function AssignmentPage({
    params,
  }: {
    params: Promise<{ idassignment: string }>
  }) {
    const idassignment = (await params).idassignment
    return <div>My Assignment: {idassignment}</div>
  }
