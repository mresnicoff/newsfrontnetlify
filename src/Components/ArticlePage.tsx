import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Box, Text, Image, Button } from "@chakra-ui/react";
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

const ArticlePage = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>(); // Aquí obtenemos el id de los params de la URL

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get<{ article: Article }>(apiUrl + `news/${id}`);
        setArticle(response.data.article);
        setLikes(response.data.article.likes);
      } catch (error) {
        console.error('Error fetching article:', error);
        // Puedes redirigir a una página de error si la consulta falla
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

  return (
    <>

      <Helmet>
      <meta charSet='utf-8'></meta>
    <title>Nueva noticia</title>
    <meta name="twitter:card" content="summary_large_image"></meta>
    <meta name="twitter:creator" content="@resnicoffmartin"></meta>
    <meta name="twitter:description" content={article.description}></meta>
    <meta name="twitter:image"   content={article.image}></meta>
    <meta name="twitter:site" content="@resnicoffmartin"></meta>
    <meta name="twitter:title" content={article.title}></meta>
    <meta property="twitter:domain" content="https://www.lasnoticias-mu.vercel.app/"></meta>
    <meta property="twitter:url" content={`https://www.lasnoticias-mu.vercel.app/articulo/${article.id}`}></meta> 
  </Helmet> 
  





      <Flex direction="column" bg="white" color="gray.800">
        <Box bg="purple.500" color="white" p={4}>
          <Text fontSize="xl">{article.title}</Text>
        </Box>
        <Flex p={4} alignItems="center">
          {article.autor.avatar && (
            <Image 
              src={article.autor.avatar} 
              alt={article.autor.nombre + "'s avatar"} 
              boxSize="50px" 
              borderRadius="full" 
              mr={2} 
            />
          )}
          <Box>
            <Text fontSize="md" color="red">{formatDate(article.date)}</Text>
            <Text color="gray.600">{article.autor.nombre}</Text>
            <ShareLinks notaid={article.id} />
          </Box>
        </Flex>
        <Box p={4}>
          <Text 
            dangerouslySetInnerHTML={{ __html: article.description }} 
            sx={{
              'p': { color: "gray.700" },
              'a': { color: "purple.600" }
            }}
          />
        </Box>
        <Flex justify="space-between" p={4}>
          <Likes id={article.id} initialLikes={likes} onLikeToggle={updateLikes} />
          <Button 
            colorScheme="purple" 
            onClick={() => navigate("/")}
          >
            Volver
          </Button>
        </Flex>
        <Box width="20%" p="4">
          <Box 
            borderWidth="1px" 
            borderColor="purple.500" 
            borderRadius="lg" 
            p="4" 
            boxShadow="md" 
            bg="white"
          >
            <Text color="purple.800">Google Ads</Text>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default ArticlePage;