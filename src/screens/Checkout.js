import React, { useState } from 'react';
import { Text, Alert, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MainContainer, Title, InputText, PersonalButton, HeaderCheckout } from './styles';
import { WebView } from 'react-native-webview';
const url = require('url');

export default function Checkout() {

    const [idPagamento, setIdPagamento] = useState("1")
    const [emailPagamento, setEmailPagamento] = useState("meuemail@gmail.com")
    const [descricaoPagamento, setDescricaoPagamento] = useState("Venda de produto digital")
    const [vlrPagamento, setVlrPagamento] = useState("5.00")
    const [showCheckout, setShowCheckout] = useState(false)

    const searchParams = (url) => {
        let query = url.slice(1);
        let partes = query.split('&');
        let data = {};
        partes.forEach(function (parte) {
            let chaveValor = parte.split('=');
            let chave = chaveValor[0];
            let valor = chaveValor[1];
            data[chave] = valor;
        });
        
        console.log(data.preference_id,'data');
    }

    const stateChange = (state) => {
        let params;
        switch (state.title) {
            case 'success':
                params = url.parse(state.url).search
                searchParams(params)
                setShowCheckout(false)
                Alert.alert("Pagamento aprovado!", `Recebemos seu pagamento de ${vlrPagamento}`)
                break;
            case 'pending':
                params = url.parse(state.url).search
                searchParams(params)
                setShowCheckout(false)
                Alert.alert("Pagamento pendente!", `Seu pagamento de ${vlrPagamento} está pendente de processamento, assim que for processado seguiremos com o pedido!`)
                break;
            case 'failure':
                params = url.parse(state.url).search
                searchParams(params)
                setShowCheckout(false)
                Alert.alert("Pagamento não aprovado!", 'Verifique os dados e tente novamente')
                break;
        }
    }

    if (!showCheckout) {
        return (

            <MainContainer>
                <Title>Protótipo de pagamento</Title>
                <InputText value={idPagamento} onChangeText={(text) => setIdPagamento(text)} placeholder={'Informe o id do produto'} keyboardType={'numeric'}></InputText>
                <InputText value={emailPagamento} onChangeText={(text) => setEmailPagamento(text)} placeholder={'Informe o e-mail do comprador'} keyboardType={'email-address'}></InputText>
                <InputText value={descricaoPagamento} onChangeText={(text) => setDescricaoPagamento(text)} placeholder={'Informe a descrição da venda'}></InputText>
                <InputText value={vlrPagamento} onChangeText={(text) => setVlrPagamento(text)} placeholder={'Informe o valor do produto'} keyboardType={'numeric'}></InputText>
                <PersonalButton onPress={() => setShowCheckout(true)}><Text>Pagar R$ {vlrPagamento}</Text></PersonalButton>

            </MainContainer>
        )
    } else {

        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <HeaderCheckout>
                    <TouchableOpacity onPress={() => setShowCheckout(false)}><Text style={{ fontSize: 20, color: 'white' }}>{"<<"}</Text></TouchableOpacity>
                    <Title>Pagamento do pedido</Title>
                </HeaderCheckout>
                <WebView
                    source={{ uri: `http://3333-c8c0110b-9684-4366-99c2-7ff93dbb95ec.ws-us02.gitpod.io/payments/checkout/${idPagamento}/${emailPagamento}/${descricaoPagamento}/${vlrPagamento}` }}
                    onNavigationStateChange={state => stateChange(state)}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator></ActivityIndicator>}
                />

            </View>
        )

    }
}