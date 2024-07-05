import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Keyboard
} from "react-native";
import { PickerItem } from "./src/Picker";
import { api } from "./src/services/api";

// Componente principal do aplicativo
export default function App() {
  // Estados para gerenciar os dados e status do aplicativo
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [moedas, setMoedas] = useState([]); // Lista de moedas

  const [moedaBValor, setMoedaBValor] = useState(""); // Valor a ser convertido
  const [valorMoeda, setValorMoeda] = useState(null); // Valor da moeda selecionada
  const [valorConvertido, setValorConvertido] = useState(0); // Resultado da conversão

  const [moedaSelecionada, setMoedaSelecionada] = useState(null); // Moeda selecionada

  // Hook useEffect para carregar as moedas ao montar o componente
  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get("all");
      let arrayMoedas = [];
      // Mapeia as chaves do objeto de resposta para criar uma lista de moedas
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key,
        });
      });

      setMoedas(arrayMoedas); // Atualiza o estado com a lista de moedas
      setMoedaSelecionada(arrayMoedas[0].key); // Define a moeda inicial selecionada
      setLoading(false); // Define o estado de carregamento como falso
    }

    loadMoedas(); // Chama a função para carregar as moedas
  }, []); // Array de dependências vazio para executar apenas uma vez

  // Função para converter o valor da moeda
  async function converter() {
    // Verifica se os campos necessários estão preenchidos
    if (moedaBValor === 0 || moedaBValor === "" || moedaSelecionada === null) {
      return;
    }

    const response = await api.get(`/all/${moedaSelecionada}-BRL`);

    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor));
    setValorConvertido(`${resultado.toLocaleString("pt-BR", {style:"currency", currency: "BRL"})}`);
    setValorMoeda(moedaBValor);

    Keyboard.dismiss(); // Fecha o teclado
  }

  // Verifica se os dados estão sendo carregados
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#101215",
        }}
      >
        <ActivityIndicator color="#FFF" size="large" />
      </View>
    );
  }

  // Renderiza a interface do usuário
  return (
    <View style={styles.container}>
      <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>Selecione sua moeda</Text>
        <PickerItem
          moedas={moedas}
          moedaSelecionada={moedaSelecionada}
          onChange={(moeda) => setMoedaSelecionada(moeda)}
        />
      </View>

      <View style={styles.areaValor}>
        <Text style={styles.titulo}>
          Digite um valor para converter em (R$)
        </Text>
        <TextInput
          placeholder="EX: 1.50"
          style={styles.input}
          keyboardType="numeric"
          value={moedaBValor}
          onChangeText={(valor) => setMoedaBValor(valor)}
        />
      </View>

      <TouchableOpacity style={styles.botaoArea} onPress={converter}>
        <Text style={styles.botaoText}>Converter</Text>
      </TouchableOpacity>

      {valorConvertido !== 0 && (
        <View style={styles.areaResultado}>
          <Text style={styles.valorConvertido}>
            {valorMoeda} {moedaSelecionada}
          </Text>

          <Text
            style={{
              fontSize: 18,
              margin: 8,
              fontWeight: "500",
              color: "#000",
            }}
          >
            Corresponde a
          </Text>

          <Text style={styles.valorConvertido}>
            {valorConvertido}
          </Text>
        </View>
      )}
    </View>
  );
}

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1, // Faz o container ocupar todo o espaço disponível
    backgroundColor: "#101215", // Cor de fundo do container
    paddingTop: 40, // Espaço superior
    alignItems: "center", // Alinhamento horizontal dos itens
  },
  areaMoeda: {
    backgroundColor: "#f9f9f9", // Cor de fundo da área da moeda
    width: "90%", // Largura da área da moeda
    borderTopLeftRadius: 8, // Arredondamento do canto superior esquerdo
    borderTopRightRadius: 8, // Arredondamento do canto superior direito
    padding: 8, // Espaçamento interno
    marginBottom: 1, // Espaçamento inferior
  },
  titulo: {
    fontSize: 16, // Tamanho da fonte do título
    color: "#000", // Cor do texto do título
    fontWeight: "500", // Peso da fonte do título
    paddingLeft: 5, // Espaçamento à esquerda
    paddingTop: 5, // Espaçamento superior
  },
  areaValor: {
    width: "90%", // Largura da área do valor
    backgroundColor: "#f9f9f9", // Cor de fundo da área do valor
    paddingTop: 8, // Espaçamento superior interno
    paddingBottom: 8, // Espaçamento inferior interno
  },
  input: {
    width: "100%", // Largura do campo de entrada
    padding: 8, // Espaçamento interno
    fontSize: 18, // Tamanho da fonte do campo de entrada
    color: "#000", // Cor do texto do campo de entrada
  },
  botaoArea: {
    width: "90%", // Largura da área do botão
    backgroundColor: "#fb4b57", // Cor de fundo do botão
    height: 45, // Altura do botão
    alignItems: "center", // Alinhamento horizontal dos itens
    justifyContent: "center", // Alinhamento vertical dos itens
    borderBottomLeftRadius: 8, // Arredondamento do canto inferior esquerdo
    borderBottomRightRadius: 8, // Arredondamento do canto inferior direito
  },
  botaoText: {
    color: "#000", // Cor do texto do botão
    fontWeight: "bold", // Peso da fonte do texto do botão
    fontSize: 16, // Tamanho da fonte do texto do botão
  },
  areaResultado: {
    width: "90%", // Largura da área de resultado
    backgroundColor: "#fff", // Cor de fundo da área de resultado
    marginTop: 34, // Espaçamento superior
    borderRadius: 8, // Arredondamento dos cantos
    alignItems: "center", // Alinhamento horizontal dos itens
    justifyContent: "center", // Alinhamento vertical dos itens
    padding: 24, // Espaçamento interno
  },
  valorConvertido: {
    fontSize: 28, // Tamanho da fonte do valor convertido
    color: "#000", // Cor do texto do valor convertido
    fontWeight: "bold", // Peso da fonte do valor convertido
  },
});
