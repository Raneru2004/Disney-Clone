import styled from "styled-components";
import React from 'react'
import ImgSlider from "./ImgSlider";
import Viewers from "./Viewers";
import Recommends from "./Recommends";
import NewDisney from "./NewDisney";
import Originals from "./Originals";
import Trending from "./Trending";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import db from "../firebase";
import { selectUserName } from "../features/user/userSlice";
import { collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { setMovies } from "../features/movie/movieSlice";


export default function Home() {
  const dispatch = useDispatch()
  const userName = useSelector(selectUserName)
  let recommends = []
  let newDisneys = []
  let originals = []
  let trending = []

  useEffect(() => {
    const getMovies = async () => {
      const {docs} = await getDocs(collection(db, "movies"))
      const movies =docs.map(doc=> ({id : doc.id, data:doc.data()}))
      movies.map((movie) => {
        switch(movie.data.type) {
          case 'recommend' :
            recommends = [...recommends, {id: movie.id, ...movie.data}]
            break;
          case 'new' :
            newDisneys = [...newDisneys, {id: movie.id, ...movie.data}]
            break;
          case 'original' :
            originals = [...originals, {id: movie.id, ...movie.data}]
            break;
          case 'trending' :
            trending = [...trending, {id: movie.id, ...movie.data}]
            break;
        }
      })

      dispatch(setMovies({
        recommend: recommends,
        newDisney: newDisneys,
        original: originals,
        trending: trending,
      }))
    }
    getMovies()
      
  }, [userName])

  return (
    <Container>
        <ImgSlider />
        <Viewers />
        <Recommends />
        <NewDisney />
        <Originals />
        <Trending />
    </Container>
  )
}

const Container = styled.main`
    position: relative;
    min-height: calc(100vh - 250px); 
    overflow-x: hidden;
    display: block;
    top: 72px;
    padding: 0 calc(3.5vw + 5px);

    &:after {
        background: url("/images/home-background.png") center center / cover no-repeat fixed;
        content: "";
        position: absolute;
        inset: 0px;
        opacity: 1;
        z-index: -1;

    }
`