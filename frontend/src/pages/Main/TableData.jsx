import { Link } from "react-router-dom";

const TableData = ({ problems }) => {
  return (
    <div className="relative mx-auto my-6 px-4">
      <table className="w-full text-gray-600 text-left border-collapse">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
          <tr>
            <th className="py-3 px-4 font-medium">Rank</th>
            <th className="py-3 px-4 font-medium">Title</th>
            <th className="py-3 px-4 font-medium">Difficulty</th>
            <th className="py-3 px-4 font-medium">Category</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((doc, idx) => {
            const difficultyColor =
              doc.difficult === "Easy"
                ? "text-green-500"
                : doc.difficult === "Medium"
                ? "text-yellow-500"
                : "text-red-500";

            return (
              <tr
                key={doc.id}
                className={`${idx % 2 === 1 ? "bg-gray-100" : "bg-white"}`}
              >
                <th className="py-2 px-4">{doc.order}</th>
                <td className="py-2 px-4">
                  <Link
                    to={`/problem/${doc.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {doc.title}
                  </Link>
                </td>
                <td className={`py-2 px-4 ${difficultyColor}`}>{doc.difficult}</td>
                <td className="py-2 px-4">{doc.category}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableData;
