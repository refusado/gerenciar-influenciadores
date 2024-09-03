export function TableHeader() {
  const headers = ['#', 'Nome', 'Instagram', 'Bairro', 'Nicho', 'Alcance'];

  return (
    <thead>
      <tr className="bg-zinc-400/5">
        {headers.map((header, index) => (
          <th
            key={index}
            scope="col"
            className="px-6 py-3 text-start text-xs font-bold uppercase"
          >
            {header}
          </th>
        ))}
        {/* span to create an empty space and make the actions (with absolute position) cover the space without overhidden */}
        <th scope="col" className="min-w-32 px-6 py-3"></th>
      </tr>
    </thead>
  );
}
