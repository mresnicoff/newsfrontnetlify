import React, {useState} from 'react';
import { useAuthContext } from '../auth/authContext';
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";

interface Option {
  value: string;
  label: string;
}

const SearchForm: React.FC = () => {
    const { setFiltersActive, setFiltrosHandler } = useAuthContext();
    const navigate = useNavigate();
    const [searchCriteria, setSearchCriteria] = useState({
        pais: '',
        categoria: 'recientes',
        autor: '',
        keywords: ''
      });
      const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value} = event.target;
        console.log(event.target.name, event.target.value)
            setSearchCriteria(prevCriteria => ({
          ...prevCriteria,
          [event.target.name]: event.target.value
        }));
      };    
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Construye la URL con los parámetros de búsqueda
    const queryParams = new URLSearchParams(searchCriteria);
    setFiltrosHandler(searchCriteria)
    console.log(searchCriteria)
    setFiltersActive();
    navigate("/");
  };

  // Datos hardcoded para países, categorías y autores
  const countries: Option[] = [
    { value: "AR", label: "Argentina" },
    { value: "BR", label: "Brasil" },
    { value: "CL", label: "Chile" },
    // Añade más países según necesites
  ];

  const categorias: Option[] = [
    { value: "politica", label: "plotica" },
    { value: "recientes", label: "recientes" },
    { value: "mundo", label: "mundo" },
    // Añade más categorías según necesites
  ];

  const autores: Option[] = [
    { value: "Martin Resnicoff", label: "Martin Resnicoff" },
    { value: "Otro", label: "Otro" },
    { value: "Tommy", label: "Tommy" },
    // Añade más autores según necesites
  ];

  return (
    <Box 
      bg={bgColor} 
      p={8} 
      borderRadius="lg" 
      boxShadow="lg" 
      maxW="md" 
      mx="auto" 
      my={10}
    >
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={4}>
          <FormControl>
            <FormLabel> País </FormLabel>
            <Select name="country" placeholder="Selecciona un país"  onChange={handleChange}>
              {countries.map(country => (
                <option key={country.value} value={country.value}>{country.label}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel> Categoría </FormLabel>
            <Select name="categoria"placeholder="Selecciona una categoría"  onChange={handleChange}>
              {categorias.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel> Autor </FormLabel>
            <Select name="autor" placeholder="Selecciona un autor"  onChange={handleChange}>
              {autores.map(autor => (
                <option key={autor.value} value={autor.value}>{autor.label}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel> Palabras Clave </FormLabel>
            <Input name="keywords" placeholder="Ingresa palabras clave"  onChange={handleChange} />
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="purple"
            alignSelf="center"
            mt={4}
          >
            Buscar
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default SearchForm;