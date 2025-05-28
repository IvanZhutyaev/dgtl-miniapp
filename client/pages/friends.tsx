import Layout from "@/components/layout";
import Link from "next/link";
import React from "react";

// Define the type for user data
interface User {
  name: string;
  coins: number;
}

const Index: React.FC = () => {
  // Sample data for users and their coin balances
  const users: User[] = [
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 },
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 },
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 },
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 },
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 }
  ];

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Main content */}
        <div className="flex-grow">
          <div className="text-center p-5">
            <h1 className="text-3xl font-bold p-2">👥 Invite friends</h1>
            <p className="p-2">Earn bonuses with your friends 🎁💸</p>
          </div>

          {/* Card Section */}
          <div className="p-3">
            <div className="card bg-base-100 text-white-content border-2 border-accent shadow-glow">
              <div className="card-body">
                <h2 className="card-title">Invite a friend!</h2>
                <p>
                  Receive{" "}
                  <span className="text-warning font-semibold">+1,000$</span>{" "}
                  for every invited friend
                </p>
              </div>
            </div>
          </div>
          <div className="pl-6">
            <h2 className="text-2xl font-bold">5 frens</h2>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto p-3">
            <table className="table w-full">

              {/* Table Body */}
              <tbody className="text-2xl font-bold">
                {users.map((user, index) => (
                  <tr key={index} className="text-2xl border-b border-neutral">
                    <td>{user.name}</td>
                    <td className="text-right">{user.coins} GTL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Button */}
        <div className="fixed bottom-20 left-0 right-0 p-3">
          <button className="btn btn-block btn-base-100 text-lg font-bold h-16 border-2 border-accent shadow-glow">
            Invite Friends
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
