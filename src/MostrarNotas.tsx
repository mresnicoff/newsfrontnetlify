// MostrarNotas.tsx
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Noticia from './Components/Noticia';
import { Flex, Box, Text, useBreakpointValue } from "@chakra-ui/react";
import NoticiaModal from './Components/NoticiaModal';  
import NewsCategories from './Components/NewsCategories';
import { useAuthContext } from './auth/authContext'; // Asegúrate de que la ruta sea correcta
interface Article {
  key: number;
  id: number;
  date: string;
  categoria: string;
  autor:{
    nombre: string;
    avatar: string;}
  title: string;
  description: string;
  content: string;
  image: string;
  likes: number;
  onClick: (id: number) => void;
  width: string | number | undefined;
}

const MostrarNotas: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { filtros } = useAuthContext(); 
  const [newsItems, setNewsItems] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const notaid = searchParams.get('notaid')
  const { keywords, categoria, pais, autor } = filtros;
 // Aquí filtras tus notas según los parámetros obtenidos

 const fetchNews = async () => {
  console.log("Entró a fetchnews", page)
  try {
    const response = await axios.get<{ articles: Article[] }>(apiUrl+`news?page=${page}`);
    const data =  response.data;
        const filteredNotes = data.articles.filter(note => {
      let matches = true;
   
    if (autor && note.autor.nombre !== autor) matches = false;
  console.log(autor,note.autor.nombre, matches)
       if (categoria!=="recientes" && note.categoria !== categoria ) matches = false;
       console.log("Categoria", categoria, "Nota",note.categoria, matches)
          if (keywords && !note.description.includes(keywords)) matches = false;
      return matches;
    });
      setNewsItems((prevNewsItems) => [...prevNewsItems, ...filteredNotes]);
    setPage(page + 1);
    if (data.articles.length === 0) {
      setHasMore(false);
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
};
useEffect(() => {
  setNewsItems([])
   console.log("cambió filtros")
  fetchNews();
 
  if (notaid) { // Si hay un notaid en la URL, abre el modal con ese ID
    handleClick(Number(notaid));
  }
}, [searchParams, filtros]);

 
 
  const handleClick = async (id: number) => {
    try {
      const response = await axios.get<{ article: Article }>(apiUrl+`news/${id}`);
      setSelectedNews(response.data.article);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching news detail:", error);
    }
  };

  const cardWidth = useBreakpointValue({ base: "100%", md: "30%" });

  return (
    <Flex direction="column" align="center">
      {/* Menú de categorías */}
      <Box width="100%" mb={4}>
        <NewsCategories setPage={setPage}/>
      </Box>

    <Flex wrap="wrap" justify="space-between">
      <Box width="95%" bg="purple">
        <InfiniteScroll
          dataLength={newsItems.length}
          next={fetchNews}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more news</p>}
        >
          <Flex wrap="wrap">
            {newsItems.map((news) => (
              <Noticia
                  key={news.id}
                  id={news.id}
                  date={news.date}
                  nombre={news.autor.nombre}
                  avatar={news.autor.avatar}
                  title={news.title}
                  content=""
                  description={news.description}
                  image={news.image}
                  onClick={() => handleClick(news.id)}
                  width={cardWidth}
                />
            ))}
          </Flex>
        </InfiniteScroll>
      </Box>

      
      {/* Aquí incluimos el componente modal */}
      <NoticiaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedNews={(selectedNews as Article)}
      />
    </Flex>
    </Flex>
  );
};

export default MostrarNotas;
