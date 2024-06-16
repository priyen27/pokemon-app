
import Image from 'next/image';
import Link from 'next/link';

const fetchPokemonDetails = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching Pokémon details for ${id}:`, error);
  }
};

const PokemonDetailsPage = async({
  params,
}) => {
  const { id } = params;
  let pokemonDetails = {};

  if (id) {
    pokemonDetails = await fetchPokemonDetails(id);
  }

  if (!pokemonDetails) {
    return <div>Loading...</div>;
  }

  const renderDetails = (title, value) => {
    // Check if 'value' is an array
    if (Array.isArray(value)) {
      // Join array elements with comma and space
      value = value.join(', ');
    }
  
    return (
      <div className="flex items-center justify-start">
        <p className="text-[14px] text-black font-normal">{title}</p>
        <p className="text-[14px] text-black font-semibold pl-2">{value}</p>
      </div>
    );
  };

  return (
    <>
      <Link href={'/'} className="text-[16px] pl-4 pt-4 border-none text-[#008b8b]">
        {'< Back'}
      </Link>
      <div className="flex justify-center items-center h-full">
        <div className="h-fit w-[300px]">
          <div className="w-full flex justify-center items-center bg-[#7FFFD4] h-[200px] rounded-t-lg">
            <Image src={pokemonDetails?.sprites?.front_default} width={300} height={200} alt="pokemon image" />
          </div>
          <div className="bg-[#bdb76b] p-6 leading-[25px] rounded-b-lg">
            {renderDetails('Name:', pokemonDetails?.name)}
            {renderDetails('Types:', pokemonDetails?.types?.map((type) => type?.type?.name))}
            {renderDetails('Stats:', pokemonDetails?.stats?.map((stat) => stat?.stat?.name))}
            {renderDetails('Abilities:', pokemonDetails?.abilities?.map((ability) => ability?.ability?.name))}
            {renderDetails('Abilities:', pokemonDetails?.abilities?.map((ability) => ability?.ability?.name))}
            {renderDetails('Some Moves:', pokemonDetails?.moves?.slice(0, 5).map((move) => move?.move?.name))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PokemonDetailsPage;
