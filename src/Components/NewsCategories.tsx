import React, { useEffect } from 'react';
import { Box, Flex, Button, useColorModeValue } from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { useNavigate } from "react-router-dom";
interface NewsCategoriesProps {
  setPage: (page: number) => void;
}
const NewsCategories: React.FC<NewsCategoriesProps> = ({setPage}) => {
  const { filtros, setFiltrosHandler } = useAuthContext();
  const bgColor = useColorModeValue("purple.500", "purple.800");
  const textColor = useColorModeValue("white", "gray.200");
  const selectedBgColor = useColorModeValue("yellow.300", "yellow.500");
  const selectedTextColor = useColorModeValue("black", "gray.800");
  const hoverBg = useColorModeValue("rgba(255, 255, 0, 0.3)", "rgba(255, 255, 0, 0.3)"); // Amarillo semitransparente
  const hoverColor = useColorModeValue("black", "white");
  const navigate = useNavigate();

  // Usamos el estado de filtros.categoria como estado local para manejar la UI
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(filtros.categoria);

  useEffect(() => {
    // Esto asegura que si filtros.categoria cambia fuera de este componente, se refleje en la UI
    setSelectedCategory(filtros.categoria);
  
  }, [filtros.categoria]);

  const handleCategorySelect = (categoria: string ) => {

   setFiltrosHandler({ ...filtros, categoria: categoria });
    setSelectedCategory(categoria);
    setPage(1)
  };

  const categories = [
    { name: 'Últimas Noticias', value: 'recientes' },
    { name: 'Política', value: 'politica' },
    { name: 'Mundo', value: 'mundo' },
  ];

  return (
    <Flex 
      bg={bgColor} 
      justifyContent="center" 
      p={2}
      width="100%"
    >
      {categories.map((category) => (
        <Button 
          key={category.value}
          variant="ghost" 
          colorScheme="purple"
          color={selectedCategory === category.value ? selectedTextColor : textColor}
          bg={selectedCategory === category.value ? selectedBgColor : 'transparent'}
          _hover={{
            bg: hoverBg, // Usamos el color semitransparente aquí
            color: hoverColor
          }}
          _active={{ bg: hoverBg, color: hoverColor }}
          ml={2}
          onClick={() => handleCategorySelect(category.value)}
        >
          {category.name}
        </Button>
      ))}
    </Flex>
  );
};

export default NewsCategories;