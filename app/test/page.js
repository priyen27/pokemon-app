async function getData() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
 
export default async function Page() {
  const data = await getData()
  console.log('>>>Data', data);
 
  return (
    <div>Hello</div>
  )
}