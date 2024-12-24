import React, { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Text, 
  useToast,
  useColorModeValue,
  Switch,
  Image // Para mostrar la imagen seleccionada
} from '@chakra-ui/react';
import axios from 'axios';
import ImageUploading from 'react-images-uploading'; // Importa ImageUploading

interface User {
  email: string;
  avatar: string;
  password: string;
  repeatPassword: string;
  nombre: string;
  puedeescribir: boolean;
  linkautor?: string;
}
interface ImageListType {
  data_url: string;
  // otras propiedades que podría tener la imagen
}
const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: '',
    avatar: '',
    password: '',
    repeatPassword: '',
    nombre: '',
    puedeescribir: false,
    linkautor: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const btnColor = useColorModeValue("purple.500", "purple.600");

  // Estado para manejar la imagen seleccionada
  const [images, setImages] = useState<any[]>([]);

  const onChange = (imageList: ImageListType[], addUpdatedIndex?: number[]) => {
    // data for submit
    setImages(imageList);
    if(imageList.length > 0) {
      setUser(prevState => ({ ...prevState, avatar: imageList[0].data_url }));
    } else {
      setUser(prevState => ({ ...prevState, avatar: '' }));
    }
  };

  const validateField = (name: string, value: string) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (value.trim() === '') newErrors.email = 'El correo electrónico no puede quedar vacío';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'El correo electrónico no es válido';
        else delete newErrors.email;
        break;
      case 'avatar':
        if (!value || value.length === 0) {
          newErrors.avatar = 'El avatar no puede quedar vacío';
        } else delete newErrors.avatar;
        break;
        case 'password':
          if (value.trim() === '') newErrors.password = 'La contraseña no puede quedar vacía';
          else if (value.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
          else delete newErrors.password;
          break;
        case 'repeatPassword':
          if (value.trim() === '') newErrors.repeatPassword = 'Repetir contraseña no puede quedar vacío';
          else if (value !== user.password) newErrors.repeatPassword = 'Las contraseñas no coinciden';
          else delete newErrors.repeatPassword;
          break;
        case 'nombre':
          if (value.trim() === '') newErrors.nombre = 'El nombre no puede quedar vacío';
          else delete newErrors.nombre;
          break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    validateField(name, type === 'checkbox' ? (checked ? 'true' : '') : value);
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    let formIsValid = true;
    // Validar todos los campos antes de enviar
    Object.keys(user).forEach((field) => {
      if (field !== 'linkautor' && field !== 'puedeescribir') {
        validateField(field, user[field as keyof User] as string);
        if (errors[field]) formIsValid = false;
      }
    });

    if (!formIsValid) {
      toast({
        title: "Error",
        description: "Por favor, corrige los errores en el formulario.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    try {
      // Subir la imagen a Cloudinary
      const formData = new FormData();
      if (images.length > 0) {
        formData.append('file', images[0].file);
        formData.append('upload_preset', uploadPreset);
        
        const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
        
        const avatarUrl = cloudinaryResponse.data.secure_url;
        console.log(avatarUrl)
        setUser(prevUser => ({ ...prevUser, avatar: avatarUrl }));

        // Ahora puedes proceder con el registro usando el avatarUrl
        const response = await axios.post(apiUrl+'nuevousuario/', {
          email: user.email,
          avatar: avatarUrl,
          password: user.password,
          nombre: user.nombre,
          puedeescribir: user.puedeescribir,
          linkautor: user.linkautor || undefined
        });

        if (response.data.success) {
          toast({
            title: "Éxito",
            description: "Registro exitoso. Redirigiendo al login",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          navigate('/loguearse');
        } else {
          toast({
            title: "Error",
            description: response.data.message || "No se pudo registrar el usuario.",
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Error subiendo la imagen a Cloudinary:', error);
      toast({
        title: "Error",
        description: "Error al subir la imagen. Inténtalo de nuevo.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (field: string) => touched[field] && errors[field];

  return (
    <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="lg" maxW="md" mx="auto" my={10}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
        <FormControl id="nombre" isRequired isInvalid={!!showError('nombre')}>
          <FormLabel color={textColor}>Nombre</FormLabel>
          <Input 
            type="text" 
            name="nombre" 
            value={user.nombre} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Nombre completo" 
          />
          {showError('nombre') && <Text color="red.500" fontSize="sm">{errors.nombre}</Text>}
        </FormControl>
        <FormControl id="email" isRequired isInvalid={!!showError('email')}>
          <FormLabel color={textColor}>Correo Electrónico</FormLabel>
          <Input 
            type="email" 
            name="email" 
            value={user.email} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Correo electrónico" 
          />
          {showError('email') && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
        </FormControl>
          <FormControl id="avatar" isRequired isInvalid={!!showError('avatar')}>
            <FormLabel color={textColor}>Imagen de Avatar</FormLabel>
            <ImageUploading
              value={images}
              onChange={onChange as any}
              maxNumber={1}
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                  <Button 
                    colorScheme="purple" 
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    {imageList.length === 0 ? 'Subir Imagen' : 'Cambiar Imagen'}
                  </Button>
                  &nbsp;
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <Image src={image['data_url']} alt="" width="100" />
                      <Button onClick={() => onImageRemove(index)}>Eliminar</Button>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
            {showError('avatar') && <Text color="red.500" fontSize="sm">{errors.avatar}</Text>}
          </FormControl>
        <FormControl id="password" isRequired isInvalid={!!showError('password')}>
          <FormLabel color={textColor}>Contraseña</FormLabel>
          <Input 
            type="password" 
            name="password" 
            value={user.password} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Contraseña"
          />
          {showError('password') && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
        </FormControl>
        <FormControl id="repeatPassword" isRequired isInvalid={!!showError('repeatPassword')}>
          <FormLabel color={textColor}>Repetir Contraseña</FormLabel>
          <Input 
            type="password" 
            name="repeatPassword" 
            value={user.repeatPassword} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Repetir contraseña"
          />
          {showError('repeatPassword') && <Text color="red.500" fontSize="sm">{errors.repeatPassword}</Text>}
        </FormControl>
        <FormControl id="puedeescribir">
          <FormLabel color={textColor}>¿Puede Escribir?</FormLabel>
          <Switch 
            name="puedeescribir" 
            isChecked={user.puedeescribir} 
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="linkautor">
          <FormLabel color={textColor}>Enlace del Autor (opcional)</FormLabel>
          <Input 
            type="text" 
            name="linkautor" 
            value={user.linkautor || ''} 
            onChange={handleChange} 
            placeholder="Enlace opcional del autor"
          />
        </FormControl>

        <Button 
          colorScheme="purple" 
          bg={btnColor} 
          type="submit" 
          isLoading={isLoading}
          loadingText="Registrando..."
        >
          Registrarse
        </Button>
      </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;