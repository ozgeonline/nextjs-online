import { getServerSession } from 'next-auth'
import { authOptions } from './utils/auth'
import { redirect } from 'next/navigation';

export default async function Home() {
  
  const session = await getServerSession(authOptions)
  if (session?.user?.email) {
    return redirect("/home")
  } else {
    return redirect("/tr-en")
  }
}
