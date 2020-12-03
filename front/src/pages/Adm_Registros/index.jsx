import React, { Component, useEffect } from 'react';
import Nav_Lateral from '../../components/Nav_Lateral'
import User_Box_Info from '../../components/User_Box_Info'
import Tabela_Registros from '../../components/Tabela_Registros'
import { Link } from 'react-router-dom'
import { Container, Adm_Area, Menu_Area, Tabela, Navegation } from './styles';
import { useHistory } from 'react-router-dom'

function Adm_Registros() {

      //Verificando Se o usuario esta autorizado para acessar essa pagina
      const history = useHistory()
    
      useEffect(() => {
          
  
          axios.get('http://localhost:3000/v1/teste', {
              method: 'GET',
              headers:  {'X-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjA3MDMyNzEyLCJleHAiOjE2MDcwMzMwMTJ9.9AR7MM57F3d7ATO_0zifm0BRYSXgCBh2cVFzgFMJNd4'}         
          }).then((res) => {
  
              if(res.data[0].auth)
              {
                  console.log('Voce tem acesso')
              }
              else
              {
                  history.push("/")
              }
  
          }).catch (() => {history.push("/")})
      }, [])
      //**Verificando Se o usuario esta autorizado para acessar essa pagina**


  return (
      <Container>

          <Menu_Area>
              <Nav_Lateral ativado="2" /> 
          </Menu_Area>

          <Adm_Area>
              <div className="User_Box_Info_Area">
                <User_Box_Info />
                <hr></hr>

                <Navegation>
                  <ul>
                    <Link >
                      <li>Registros</li>
                    </Link>

                  </ul>
                </Navegation>

              </div>
              <Tabela> 
                <Tabela_Registros />
              </Tabela>
          </Adm_Area>
      </Container>
  );
}




export default Adm_Registros;

