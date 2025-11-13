"use client";

import { BiSearch } from "react-icons/bi";

interface Customer {
  _id: string;
  sender: string;
  receiver: string;
  partnerName: string;
  email: string;
  profileImage: string;
  isOnline: boolean;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getInitials: (email: string) => string;
  getUserName: (email: string) => string;
  getTimeAgo: (dateString: string) => string;
}

const CustomerList = ({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  searchQuery,
  setSearchQuery,
  getInitials,
  getUserName,
  getTimeAgo,
}: Props) => {
  const filteredCustomers = customers.filter((customer) =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(
    "getInitials(customer.email):",
    getInitials(filteredCustomers[0]?.email)
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>
        <div className="relative">
          <BiSearch className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.map((customer) => (
          <div
            key={customer._id}
            onClick={() => setSelectedCustomer(customer)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedCustomer?._id === customer._id ? "bg-indigo-50" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {customer.profileImage ? (
                  <img
                    src={customer.profileImage}
                    alt={customer.email}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {getInitials(customer.email)}ali_test
                  </div>
                )}
                {customer.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {getUserName(customer.email)}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(customer.updatedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {customer.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
