import { useState, useEffect } from "react";

// Definiera en typ för medlemmen
interface Member { // skapar en interface för att definiera en typ för medlemmen
  id: number;
  name: string;
  email: string;
  role: "admin" | "operator"; // Begränsar rollerna till dessa två.
  avatar: string;
}

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]); // members är en array av Member

  useEffect(() => {
    fetch("http://localhost:5000/api/users") //Hämtar datan från backend
      .then((res) => res.json()) // Gör om datan till json
      .then((data: Member[]) => setMembers(data)) // Definiera typen för data
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Members</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between border-b py-3">
            <div className="flex items-center space-x-4">
              <img src={member.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-gray-500 text-sm">{member.email}</p>
              </div>
            </div>
            <select className="border p-2 rounded" defaultValue={member.role}>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
