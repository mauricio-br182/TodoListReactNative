
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert , Keyboard, AsyncStorage } from 'react-native';
import { Ionicons, MaterialIcons} from '@expo/vector-icons'; 
import React,{ useState, useEffect} from "react"

export default function App() {

  const [task, setTask] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(()=>{
    async function recarregaDados(){
      const task = await AsyncStorage.getItem('task')

      if(task){
        setTask(JSON.parse(task))
      }

    }

    recarregaDados()
  },[])

  useEffect(()=>{
    async function salveDados(){
      AsyncStorage.setItem('task', JSON.stringify(task))
    }
    salveDados()
  },[task])

  async function addTask(){
    if(newTask === ''){
      return
    }
    const search = task.filter(task => task === newTask)

    if(search.length !== 0){
      Alert.alert('Atenpt', 'Task already exists')
      return
    }
    
    setTask([...task, newTask])
    setNewTask('')
    Keyboard.dismiss()
  }

  async function removeTask(item){
    Alert.alert(
      'Deletar Task',
      'Tem certeza que deseja remover essa anotação?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return
          },
          style: 'cancel'

        },
        {
          text: 'Excluir',
          onPress: () => { setTask(task.filter(task => task !== item)) }
        },
        
      ]

    )
    
  }
  

  return (
    <KeyboardAvoidingView
    keyboardVerticalOffset={0}
    behavior='padding'
    style={{flex: 1}}
    enabled={Platform.OS === 'ios'}>

    <View style={styles.container}>
      <View style={styles.body}>
        <FlatList style={styles.FlatList}
        data={task}
        keyExtractor={item => item.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item})=>(
          <View style={styles.containerView}>
            <Text style={styles.texto}>{item}</Text>
            <TouchableOpacity onPress={()=>{removeTask(item)}}>
              <MaterialIcons
              name='delete-forever'
              size={25}
              color='#f64c75'/>
            </TouchableOpacity>
          </View>
        )}
        />
        
      </View>
      <View style={styles.form}>
        <TextInput 
        style={styles.Input}
        placeholderTextColor='#999'
        autoCorrect={true}
        placeholder='Adicione uma taréfa'
        maxLength={25}
        onChangeText={text => setNewTask(text)}
        value={newTask}
        />
        <TouchableOpacity style={styles.Button} onPress={()=>{addTask()}}>
        <Ionicons name="add-outline" size={24} color="white" />
           </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop:20,
  },
  body:{
    flex: 1,
  },
  form: {
    padding: 0,
    height: 60,
    justifyContent:'center',
    alignItems: 'stretch',
    flexDirection: 'row',
    paddingTop:13,
    borderTopWidth: 1,
    borderColor: '#fff',
    
  } ,
  Input:{
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  Button:{
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    marginLeft:10,
  },
  FlatList: {
    flex: 1,
    marginTop: 5,

  },
  containerView:{
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
  texto: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center'


  }
});
