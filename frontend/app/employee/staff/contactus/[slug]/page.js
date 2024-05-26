async function getContactData() {
  const res = await fetch("http://localhost:5001/api/contactview")
  if (!res.ok) {
    throw new Error("Failed to fetch customer message!!!")
  }

  return res.json()
}

export default async function ContactDetailPage(props) {
  const _id = props.params.slug
  const allContactData = await getContactData()
  const matchedContact = allContactData.find((contact) => contact._id === _id)

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-5">Customer Contact Detail</h1>
      <div className="flex flex-col items-start bg-blue-100 p-6 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3">
        <h2 className="text-2xl font-semibold mb-3">{matchedContact.name}</h2>
        <p className="text-lg mb-2"><strong>Email:</strong> <a href={`mailto:${matchedContact.email}`} className="text-blue-500 underline">{matchedContact.email}</a></p>
        <p className="text-lg"><strong>Message:</strong> {matchedContact.message}</p>
      </div>
    </div>
  )
}
