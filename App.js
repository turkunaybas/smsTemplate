import React, { useState, useEffect, } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';
import * as SMS from 'expo-sms';

export default function App() {

  const [contacts, setContacts] = useState("")
  const [memoryContacts, setMemoryContacts] = useState("")
  const [phone, setPhone] = useState("")
  const [body, setBody] = useState("")
  const [loader, setLoader] = useState(false)
  const [newValue, setNewValue] = useState("")
  const [messages, setMessages] = useState([])



  //Rehberden kişilerimi alan fonksiyon .Eğer rehber izni verirsem erişebilir vermezsem tekrar sorar. Eriştiği kişileri statede bulunan contacts listesine setler
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data)
          setMemoryContacts(data)
          console.log(contacts)

            ;
        }
      }
    })();
  }, []);




  //Arama yaptığımda kullandığım fonksiyon 
  //memoryContacts rehberden çekilen kişileri ikinci setlediğimiz alan
  //arama yaparken bu liste içinde arıyoruz değerleri kaybetmemek için çünkü bulduğum değerleri contacks listesine setliyorum 
  //o zaman liste değişeceği için eski veriler gidiyor ve silip tekrar ararsam göremiyorum. Yedek liste memoryContacts
  const searchContacts = (value) => {

    const filterContacts = memoryContacts.filter(
      contact => {
        let contactLowercase = contact.name.toLowerCase()
        let searchValueLowercase = value.toLowerCase()
        return contactLowercase.indexOf(searchValueLowercase) > -1

      }
    )
    setContacts(filterContacts);
  }



  return (
    <View style={styles.container}>

      <View style={{ width: "100%", backgroundColor: "#2f363c", marginTop: "5%", flexDirection: "row", alignItems: "center", borderBottomColor: "#bad555", borderBottomWidth: 1 }}>

        {/* kişi araması yaptığım alan */}
        <TextInput style={{ width: "85%", backgroundColor: "#2f363c", height: 50, paddingLeft: "3%", }}
          placeholder='Kişi Ara'
          placeholderTextColor={"#bad555"}
          fontSize={20}
          onChangeText={(value) => searchContacts(value)}

        />
        <Ionicons name="send" size={30} style={{ marginLeft: "5%", color: "#bad555" }}

          //bu fonksiyon benden bir mesaj ve numara alarak smse yönlendirme yapıyor expo sms kütüphanesinden kullanılıyor.
          //eğer mesaj ve kişi seçmediysem uyuarı dönüyor seçtiysem sms atıyor
          onPress={async () => {

            if (body === "" || phone === "") {
              alert("Göndermeden Önce Lütfen Kişi ve Mesaj Seçtiğinizden Emin Olun")
            }
            else {
              await SMS.sendSMSAsync(
                [phone],
                body,
              );
            }

          }} />


      </View>


      {/* kişi alanı */}

      <View style={{ flex: 1, backgroundColor: "#2f363c", paddingTop: 10 }} >

        {loader &&

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#bad555" />
          </View>
        }


        {/* kişilerimi listelediğim flatlist */}
        <FlatList data={contacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={
            ({ item }) =>

              <TouchableOpacity style={{ padding: 5, minHeight: 70 }} onPress={() => setPhone(item.phoneNumbers[0].number)}>
                <Text style={{ color: phone === item.phoneNumbers[0].number ? "red" : "#bada55", fontSize: 20, fontWeight: "bold" }}>
                  {item.name}
                </Text>
                <Text style={{}}>
                  {item.phoneNumbers[0].number}
                </Text>
              </TouchableOpacity>


          }
          ListEmptyComponent={() =>

            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 50 }}>
              <Text style={{ color: "#bad555" }}> kişiler yok     </Text>
            </View>
          }
        />

      </View>
      <View style={{ width: "100%", height: "30%", backgroundColor: "#bad555", justifyContent: "flex-end" }}>


        {/* bu alanda oluşturduğum templateleri görüyorum  sağa doğru kaydırmak için ScrollView kullanıp horizontal diyerek yatay yaptık */}
        <ScrollView horizontal style={{ backgroundColor: "#bad555", }}>

          <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", width: "100%" }} >
            {messages && messages.length > 0 &&
              messages.map((item, index) =>

                // eğer template'e tıklarsa onu statedeki bodye setler bu da göndermek istediğim mesaj demek
                <TouchableOpacity key={`messages-${index}`} onPress={() => setBody(item)} style={{
                  alignItems: "center", justifyContent: "center", backgroundColor: body === item ? "#fade8c" : "#e4e7ed", height: 50, padding: 6, marginLeft: 15,
                  borderRadius: 10, borderWidth: 1, borderColor: "#2f363c"
                }}>
                  <Text style={{ fontSize: 17, color: "black" }}>{item}</Text>
                </TouchableOpacity>
              ) }
          </View>

        </ScrollView>

        {/* template oluşturduğum alan textınputun içine yazılanı template listesine ekleyerek setler ,  */}

        <View style={{ height: "30%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 5, marginTop: "1%" }}>
          <TextInput style={{
            width: "85%", backgroundColor: "#e4e7ed", height: "100%", borderColor: "#fff",
            borderWidth: 1, borderRadius: 10, marginLeft: "2%", paddingLeft: "4%", marginBottom: "1%"
          }} placeholder='Yeni Template Oluştur' placeholderTextColor={"#bad555"}
            // değişen texti state setledik
            fontSize={20} onChangeText={(text) => setNewValue(text)} />


          {/* statedeki texti de kaydete tıklayınca messages listesine ekledik */}
          <Ionicons name="create" size={55} onPress={() => setMessages([...messages, newValue])} />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
