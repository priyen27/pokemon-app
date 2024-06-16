"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { FiSearch } from "react-icons/fi";

import Card from "@/components/shared/card";
import { useDebounce } from "@/hooks/useDebounce";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);

  const { control, register, watch } = useForm();
  const selectedType = watch("pokemonType");
  const searchValue = watch('search');

  const debouncedSearchValue = useDebounce(searchValue, 1000); // It will return debounced value after 1000ms

  useEffect(() => {
    // Function to fetch a list of Pokémon with basic details
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon list');
        }
        const data = await response.json();
        return data?.results;
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
        return [];
      }
    };

    // Function to fetch detailed information for a Pokemon based on its URL
    const fetchPokemonDetails = async (pokemonUrl) => {
      try {
        const response = await fetch(pokemonUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon details');
        }
        const data = await response.json();
        // return data; // Detailed Pokémon object
        return {
          id: data?.id,
          name: data?.name,
          types: data?.types?.map((type) => type?.type?.name), // Extracting types
          image: data?.sprites?.front_default,
        };
      } catch (error) {
        console.error(`Error fetching Pokémon details for ${pokemonUrl}:`, error);
        return null;
      }
    };

    const fetchPokemonData = async () => {
      setLoading(true);
      const results = await fetchPokemonList();
      if (results?.length === 0) {
        return;
      }

      // Map over the results array and fetch details for each Pokemon concurrently
      const pokemonDetails = await Promise.all(results?.map(pokemon => fetchPokemonDetails(pokemon?.url)));
      setPokemonList(pokemonDetails?.filter(pokemon => pokemon !== null));

      const allPokemonTypes = pokemonDetails?.flatMap((pokemon) => pokemon.types);
      const uniquePokemonTypes = Array.from(new Set(allPokemonTypes));

      // Create options array in format required by react-select
      const options = uniquePokemonTypes.map((type) => ({
        value: type,
        label: type?.charAt(0)?.toUpperCase() + type?.slice(1), // Capitalize the first letter
      }));
      setPokemonTypes(options);
      setLoading(false);
    };

    // Invoke the fetch function
    fetchPokemonData();

    return () => {
      setPokemonList([]);
      setPokemonTypes([]);
      setFilteredPokemonList([]);
      setLoading(false);
    };
  }, []);

  // logic for filtering by type
  useEffect(() => {
    if (selectedType) {
      const filteredList = pokemonList?.filter(pokemon => pokemon.types.includes(selectedType.value));
      setFilteredPokemonList(filteredList);
    } else {
      setFilteredPokemonList(pokemonList);
    }
  }, [selectedType, pokemonList]);

  // logic for searching
  useEffect(() => {
    if (debouncedSearchValue) {
      const filteredList = pokemonList?.filter(pokemon => pokemon?.name?.includes(debouncedSearchValue));
      setFilteredPokemonList(filteredList);
    } else {
      setFilteredPokemonList(pokemonList);
    }
  }, [debouncedSearchValue, pokemonList]);

  const handleSearch = () => {
    if (debouncedSearchValue) {
      const filteredList = pokemonList?.filter(pokemon => pokemon?.name?.includes(debouncedSearchValue));
      setFilteredPokemonList(filteredList);
    } else {
      setFilteredPokemonList(pokemonList);
    }
  };
  console.log('>>> filteredPokemonList:', filteredPokemonList)

  return (
    <div className="">
      <div className="p-4 space-y-4">
        <form>
          <div className="mt-4">
            <Controller
              name="pokemonType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={pokemonTypes}
                  placeholder="Select"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "white",
                      color: "black",
                      width: '300px',
                      height: '45px',
                    }),
                    option: (provided) => ({
                      ...provided,
                      color: "black",
                      width: '300px'
                    }),
                    menu: (provided) => ({
                      ...provided,
                      width: '300px', // Ensure menu width matches control width
                    }),
                  }}
                  isClearable
                />
              )}
            />
          </div>
          <div className="flex items-center">
            <div className="flex items-center pl-3 pointer-events-none absolute xs:top-[13%] md:top-[14%] left-[12px]">
              <FiSearch className="h-5 w-5 text-gray-400" />{" "}
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-[300px] mt-[1rem] pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
              {...control}
              {...register('search')}
            />
            <button
              type="button"
              className="w-[90px] h-[38px] mt-4  bg-[#00008B] text-white py-2 px-4 hover:bg-purple-600 transition-colors rounded-lg ml-2"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filteredPokemonList?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
          {filteredPokemonList?.map(pokemon => (
            <Card key={pokemon.id} id={pokemon.id} name={pokemon?.name} imageSrc={pokemon?.image} />
          ))}
        </div>
      ) : (
        <div className="text-[18px] text-black w-full h-[500px] flex justify-center items-center">No Pokémon found</div>
      )}
    </div>
  );
};

export default App;
