import Header from '@/components/Header'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const FAQs = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const faqData = [
    {
      id: 1,
      question: 'What is KUBOT Token?',
      answer: 'KUBOT Token is a community-driven digital asset designed to empower users, businesses, and creators. It serves as a bridge between real-world value and decentralized finance (DeFi), offering a seamless ecosystem for payments, rewards, staking, and governance.'
    },
    {
      id: 2,
      question: 'How can I purchase KUBOT tokens?',
      answer: 'KUBOT tokens can be purchased through supported cryptocurrency exchanges and decentralized platforms. You will need a compatible wallet and can swap other cryptocurrencies for KUBOT tokens.'
    },
    {
      id: 3,
      question: 'What can I use KUBOT tokens for?',
      answer: 'KUBOT tokens can be used for various purposes including payments, earning rewards, staking for passive income, participating in governance decisions, and accessing exclusive features within the KUBOT ecosystem.'
    },
    {
      id: 4,
      question: 'Is KUBOT Token secure?',
      answer: 'Yes, KUBOT Token is built on blockchain technology with robust security measures. All transactions are transparent, immutable, and secured through cryptographic protocols. However, always ensure you use secure wallets and follow best practices.'
    },
    {
      id: 5,
      question: 'How does staking work?',
      answer: 'Staking allows you to lock your KUBOT tokens for a specified period to earn rewards. By staking, you support the network\'s security and operations while earning passive income in return.'
    },
    {
      id: 6,
      question: 'Can I participate in governance?',
      answer: 'Yes, KUBOT token holders can participate in governance by voting on proposals that shape the future of the ecosystem. Your voting power is proportional to the number of tokens you hold.'
    },
    {
      id: 7,
      question: 'What makes KUBOT different from other tokens?',
      answer: 'KUBOT focuses on real-world integration, user-friendly experience, truly decentralized governance, and sustainable utility. It aims to bridge the gap between traditional finance and decentralized systems.'
    },
    {
      id: 8,
      question: 'How do I contact support?',
      answer: 'You can reach our support team through the official website, community channels on Telegram and Discord, or by emailing support@kubot.com. Our team is ready to assist you with any questions.'
    }
  ]

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style='light'/> 
      <Header text=''/>

      <ScrollView className='px-6 pt-4'>
        <View>
          <Text className='text-2xl text-center font-extrabold' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
            FAQs
          </Text>
          <Text className='text-base text-center text-gray-500 pt-2' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            Frequently Asked Questions
          </Text>
        </View>

        <View className='pt-6'>
          {faqData.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              onPress={() => toggleExpand(faq.id)}
              className='mb-3 bg-white rounded-lg p-5'
              style={{ 
                // borderWidth: 1, 
                // borderColor: '#E5E7EB',
              }}
            >
              <View className='flex-row justify-between items-center'>
                <Text 
                  className='text-base flex-1 pr-2' 
                  style={{fontFamily: 'HankenGrotesk_600SemiBold'}}
                >
                  {faq.question}
                </Text>
                <Text 
                  className='text-xl text-gray-400'
                  style={{fontFamily: 'HankenGrotesk_500Medium'}}
                >
                  {expandedId === faq.id ? '−' : '+'}
                </Text>
              </View>
              
              {expandedId === faq.id && (
                <Text 
                  className='text-sm text-gray-500 leading-relaxed pt-3' 
                  style={{fontFamily: 'HankenGrotesk_400Regular'}}
                >
                  {faq.answer}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

export default FAQs