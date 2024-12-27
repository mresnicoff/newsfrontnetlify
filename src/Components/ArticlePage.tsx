import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Box, Text, Image, Button, useMediaQuery } from "@chakra-ui/react";
import { formatDate } from '../hooks/dateFormat';
import Likes from './Likes';
import axios from 'axios';
import ShareLinks from './ShareLinks';
import { Helmet } from 'react-helmet-async';

interface Article {
  id: number;
  date: string;
  autor: {
    nombre: string;
    avatar: string;
  };
  title: string;
  description: string;
  content: string;
  image: string;
  likes: number;
}
interface LikeProps {
  id: number;
  initialLikes: number;
  onLikeToggle: (id: number, liked: boolean) => void;
  fontSize?: string; // Puedes definir un tipo más específico si lo necesitas, como 'sm' | 'md' | 'lg'
}

interface ShareLinksProps {
  notaid: number;
  fontSize?: string;
  buttonSize?: string;
}

const ArticlePage = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>();
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get<{ article: Article }>(apiUrl + `news/${id}`);
        setArticle(response.data.article);
        setLikes(response.data.article.likes);
      } catch (error) {
        console.error('Error fetching article:', error);
        navigate('/error', { replace: true });
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, navigate]);

  const updateLikes = async (id: number, liked: boolean) => {
    setLikes(prevLikes => prevLikes + (liked ? 1 : -1));
    try {
      if (liked) {
        await axios.post(apiUrl + `likes/${id}`, { action: 'increment' });
      } else {
        await axios.post(apiUrl + `likes/${id}`, { action: 'decrement' });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  // Ajustes para pantallas pequeñas
  const fontSize = isSmallScreen ? "2x1" : "md"; // Aumenta el tamaño de la fuente en pantallas pequeñas
  const buttonSize = isSmallScreen ? "2x1" : "md"; // Aumenta el tamaño de los botones en pantallas pequeñas

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Nueva noticia</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@resnicoffmartin" />
        <meta name="twitter:description" content="Esta nota es muy interesante" />
        <meta name="twitter:image" content={article.image} />
        <meta name="twitter:site" content="@resnicoffmartin" />
        <meta name="twitter:title" content={article.title} />
        <meta property="twitter:domain" content="https://www.lasnoticias-mu.vercel.app/" />
        <meta property="twitter:url" content={`https://www.lasnoticias-mu.vercel.app/articulo/${article.id}`} />
      </Helmet> 

      <Flex direction="column" bg="white" color="gray.800">
        <Box bg="purple.500" color="white" p={4}>
          <Text fontSize={isSmallScreen ? "2xl" : "xl"}>{article.title}</Text>
        </Box>
        <Flex p={4} alignItems="center" direction={isSmallScreen ? "column" : "row"}>
          {article.autor.avatar && (
            <Image 
              src={article.autor.avatar} 
              alt={article.autor.nombre + "'s avatar"} 
              boxSize={isSmallScreen ? "75px" : "50px"} 
              borderRadius="full" 
              mb={isSmallScreen ? 2 : 0}
            />
          )}
          <Box>
            <Text fontSize={fontSize} color="red">{formatDate(article.date)}</Text>
            <Text color="gray.600" fontSize={fontSize}>{article.autor.nombre}</Text>
            <ShareLinks notaid={article.id} fontSize={fontSize} buttonSize={buttonSize} />
          </Box>
        </Flex>
        <Box p={4}>
          <Text 
            dangerouslySetInnerHTML={{ __html: article.description }} 
            sx={{
              'p': { color: "gray.700", fontSize: fontSize },
              'a': { color: "purple.600" }
            }}
          />
        </Box>
        <Flex justify="space-between" p={4} direction={isSmallScreen ? "column" : "row"}>
        <Likes id={article.id} initialLikes={likes} onLikeToggle={updateLikes} fontSize={fontSize} />
          <Button 
            colorScheme="purple" 
            size={buttonSize}
            onClick={() => navigate("/")}
          >
            Volver
          </Button>
        </Flex>
        <Box width={isSmallScreen ? "100%" : "20%"} p="4">
          <Box 
            borderWidth="1px" 
            borderColor="purple.500" 
            borderRadius="lg" 
            p="4" 
            boxShadow="md" 
            bg="white"
          >
            <Text color="purple.800" fontSize={fontSize}>Google Ads</Text>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default ArticlePage;