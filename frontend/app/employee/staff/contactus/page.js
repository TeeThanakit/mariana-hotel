import AllPosts from "@/components/contactposts/all-posts";

async function getContactData() {
  try {
    const response = await fetch("http://localhost:5001/api/contactview", {
      next: {
        revalidate: 1,
      },
    });
    const jsonData = await response.json();
    if (response.ok) {
      return jsonData;
    } else {
      throw new Error("Failed to fetch data: " + jsonData.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching data: " + error.message);
  }
}

export default async function ContactUsDetail(props) {
  const data = await getContactData();
  return (
    <div>
      <AllPosts contact={data} />
    </div>
  );
}