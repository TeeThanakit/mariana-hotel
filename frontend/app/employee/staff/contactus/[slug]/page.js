async function getContactData() {
  const res = await fetch("http://localhost:5001/api/contactview");
  if (!res.ok) {
    throw new Error("Failed to fetch customer message!!!");
  }

  return res.json();
}

export default async function ContactDetailPage(props) {
  const _id = props.params.slug;
  const allContactData = await getContactData();
  const matchedContact = allContactData.find((contact) => contact._id === _id);
  return (
    <div className="flex flex-col items-center mt-5">
      <h1 className="text-2xl">Customer Contact Detail Page</h1>
      <div className="flex flex-col items-center mt-3 bg-patty-blue rounded-2xl w-2/3 h-2/3">
        <h1>Coustomer name:{matchedContact.name}</h1>
        <p>
          <a>Email: {matchedContact.email}</a>
        </p>
        <p>Message: {matchedContact.message}</p>
      </div>
    </div>
  );
}
