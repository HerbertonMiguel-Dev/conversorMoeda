import { Picker } from "@react-native-picker/picker";

export function PickerItem(props) {
  // Mapeia as moedas recebidas como props para Picker.Item
  let moedasItem = props.moedas.map((item, index) => {
    return <Picker.Item value={item.key} key={index} label={item.key} />
  })

  return (
    <Picker 
      selectedValue={props.moedaSelecionada} // Valor selecionado no Picker
      onValueChange={(valor) => props.onChange(valor)} // Função chamada ao mudar o valor selecionado
    >
        {/* Renderiza as opções do Picker */}
      {moedasItem} 
    </Picker>
  );
}
