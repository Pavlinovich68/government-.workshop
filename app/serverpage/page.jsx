import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function page() {
   const session = await getServerSession(authOptions);
   console.log(session);
   return (
      <div>
         {session.user.name}
      </div>
   )
}