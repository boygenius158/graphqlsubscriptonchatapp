
const ChatScreen = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const data = useMemo(() => [
    { id: 1, name: "Alice", message: "Hello!" },
    { id: 2, name: "Bob", message: "How are you?" },
    { id: 3, name: "Charlie", message: "Good morning!" },
  ], []);

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "message",
      header: "Message",
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });
  console.log("lo",table.getHeaderGroups());
  
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 mb-4 w-full"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table className="w-full border-collapse border">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="border p-2 cursor-pointer"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : " sort"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChatScreen;
