import Link from "next/link";

export default function Postsitem(props) {
  const { name, email, _id } = props.post;

  const linkPath = `/employee/staff/contactus/${_id}`;

  return (
    <li className="shadow-md bg-yellow-950 text-center" key={_id}>
      <Link href={linkPath} className="text-white">
        <div className="p-2">
          <h3 className="text-1xl">Name: {name}</h3>
          <p className="leading-6">Email: {email}</p>
        </div>
      </Link>
    </li>
  );
}
