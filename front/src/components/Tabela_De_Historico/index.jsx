import React, { Component, useState } from 'react';
import ReactPaginate from 'react-paginate'
import SaibaMais from '../SaibaMais'
import { Container, Info, Tabela, Title, Pesquisa, Input } from './styles';
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies()




export class Tabela_De_Historico extends Component {

  //Iniciando o componente com o construtor recebendo as props e iniciando os estados
  constructor(props) {
    super(props)

    this.state = {
      offset: 0,
      tableData: [],
      orgtableData: [],
      perPage: 5,
      currentPage: 0,
      search: '',

      User_info: {},
      Requisicoes: {}

    }
    this.handlePageClick = this.handlePageClick.bind(this);

  }



  //funcao para fazer a ppaginacao funciona
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
      currentPage: selectedPage,
      offset: offset
    }, () => {
      this.loadMoreData()
    });

  };

  //Caregar mais pessoas quando mudas de paginacao
  loadMoreData() {
    const data = this.state.orgtableData;

    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
    this.setState({
      pageCount: Math.ceil(data.length / this.state.perPage),
      tableData: slice
    })

  }


  componentDidMount() {

    var token = cookies.get('tokenJWT')

    //Requisicao para pegar as informmacoes do usuarios para pegar apenas as requisicoes dele
    axios.get(process.env.REACT_APP_SERVER_TO_AUTHENTICATE, {
      method: 'GET',
      headers: { 'X-access-token': token }
    }).then((res) => {


      if (res.data[0].auth) {
        //Pegando as informacoes do user pelo nif
        let url = "http://localhost:3000/v1/buscar-user-nif/" + `${res.data[0].nif}`

        axios.get(url).then(async (res) => {




          this.setState({
            User_info: res.data
          })

          //Aqui vai o fetch para a api pegar os registros no banco de dados


          let url = `http://localhost:3000/v1/pegar-requisicao/${this.state.User_info.nif}`

          axios.get(url).then((result) => {

            console.log(result)
            this.setState({
              Requisicoes: result.data
            })

            console.log("ola aquii")
            console.log(result.data)
            // slice = de quanto a quanto sera exibido na tela
            // slice = data.slice(15, 15 + 5) 
            //slice = 20, ou seja na pagina ira commecar a listar pelo numero 20
            var slice = result.data.slice(this.state.offset, this.state.offset + this.state.perPage)
            console.log(slice)
  
            this.setState({
              pageCount: Math.ceil(result.data.length / this.state.perPage),
              orgtableData: result.data,
              tableData: slice
            })


          })




        }).catch((err) => {
          console.log(err)
        })
      }
    })



  }


  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) })
  }


  render() {

    let filterRegister = this.state.tableData.filter(
      (register) => {
        return register.nome.toLowerCase().indexOf(this.state.search) !== -1 ||
          register.nome.indexOf(this.state.search) !== -1 ||
          register.nome_requisicao.toLowerCase().indexOf(this.state.search) !== -1 ||
          register.nome_requisicao.indexOf(this.state.search) !== -1 ||
          register.data_envio.indexOf(this.state.search) !== -1 ||
          register.data_entrega.indexOf(this.state.search) !== -1 ||
          register.nome_departamento.toLowerCase().indexOf(this.state.search) !== -1 ||
          register.nome_departamento.indexOf(this.state.search) !== -1 ||
          register.centro_custo.toLowerCase().indexOf(this.state.search) !== -1 
      }
    )

    return (
      <Container>

        <Info>
          <Title>Historico de Registros</Title>
          <Pesquisa>
            <p>pesquisa:</p>
            <Input
              value={this.state.search}
              onChange={this.updateSearch.bind(this)}
              placeholder="Ex: Danilo" />
          </Pesquisa>
        </Info>
        <Tabela>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col"><strong>numero</strong></th>
                <th scope="col"><strong>nome da requisicao</strong></th>
                <th scope="col"><strong>solicitante</strong></th>
                <th scope="col"><strong>departamento</strong></th>
                <th scope="col"><strong>cc</strong></th>
                <th scope="col"><strong>paginas</strong></th>
                <th scope="col"><strong>cópias</strong></th>
                <th scope="col"><strong>total de paginas</strong> </th>
                <th scope="col"><strong>data do pedido</strong></th>
                <th scope="col"><strong>data de entrega</strong></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>

              {
                filterRegister.map((element) => (
                  <tr>
                    <td>{element.id_requisicao}</td>
                    <td>{element.nome_requisicao}</td>
                    <td>{element.nome}</td>
                    <td>{element.nome_departamento}</td>
                    <td>{element.centro_custo}</td>
                    <td>{element.num_paginas}</td>
                    <td>{element.num_copias}</td>
                    <td>{element.total_paginas}</td>
                    <td>{element.data_envio}</td>
                    <td>{element.data_entrega}</td>
                    <td><SaibaMais caminho="detalhes" data={element.id_requisicao} /></td>

                  </tr>

                ))
              }


            </tbody>
          </table>
        </Tabela>
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} />

        <hr></hr>
        <p style={{ color: "#ccc", fontSize: "15px" }}>@SENAI Suíço-Brasileira "Paulo Ernesto Tolle"</p>

      </Container>
    )
  }
}



export default Tabela_De_Historico;

