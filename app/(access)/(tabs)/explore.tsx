import LoadingOverlay from '@/components/LoadingOverlay'
import { Ionicons } from '@expo/vector-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { StatusBar } from 'expo-status-bar'
import React, { JSX, useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
})

// Types
interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  total_volume: number
  circulating_supply: number
  ath: number
  atl: number
  max_supply?: number
  fully_diluted_valuation?: number
}

interface TrendingCoin {
  item: {
    id: string
    name: string
    symbol: string
    market_cap_rank: number
    thumb: string
    price_btc: number
    score: number
  }
}

interface CoinDetails {
  id: string
  symbol: string
  name: string
  image: {
    large: string
  }
  market_cap_rank: number
  description: {
    en: string
  }
  links: {
    homepage: string[]
    blockchain_site: string[]
    official_forum_url: string[]
  }
  market_data: {
    current_price: {
      usd: number
    }
    market_cap: {
      usd: number
    }
    total_volume: {
      usd: number
    }
    price_change_percentage_24h: number
    circulating_supply: number
    total_supply?: number
    max_supply?: number
    ath: {
      usd: number
    }
    atl: {
      usd: number
    }
  }
}

type TabType = 'tokens' | 'trending' | 'memes' | 'watchlist'

const { width } = Dimensions.get('window')

const fetchCoins = async (): Promise<Coin[]> => {
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 200,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h'
    }
  })
  return data
}

const fetchTrendingCoins = async (): Promise<TrendingCoin[]> => {
  const { data } = await api.get('/search/trending')
  return data.coins
}

const fetchMemeCoins = async (): Promise<Coin[]> => {
  const memeTokenIds = 'dogecoin,shiba-inu,pepe,floki,bonk,dogwifcoin,memecoin,baby-doge-coin,samoyedcoin,monacoin'
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      ids: memeTokenIds,
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h'
    }
  })
  return data
}

const fetchCoinDetails = async (coinId: string): Promise<CoinDetails> => {
  const { data } = await api.get(`/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false
    }
  })
  return data
}

const Explore: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('tokens')
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)
  const [modalLoading, setModalLoading] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const { data: coins = [], isLoading: coinsLoading, refetch: refetchCoins } = useQuery({
    queryKey: ['coins'],
    queryFn: fetchCoins,
  })

  const { data: trendingCoins = [], isLoading: trendingLoading, refetch: refetchTrending } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrendingCoins,
  })

  const { data: memeCoins = [], isLoading: memesLoading, refetch: refetchMemes } = useQuery({
    queryKey: ['memes'],
    queryFn: fetchMemeCoins,
  })

  const { data: selectedCoin, isLoading: coinDetailsLoading } = useQuery({
    queryKey: ['coinDetails', selectedCoinId],
    queryFn: () => fetchCoinDetails(selectedCoinId!),
    enabled: !!selectedCoinId,
    staleTime: 60000,
  })

  const loading = coinsLoading || trendingLoading || memesLoading

  const onRefresh = async (): Promise<void> => {
    await Promise.all([
      refetchCoins(),
      refetchTrending(),
      refetchMemes()
    ])
  }

  const handleCoinPress = useCallback(async (coinId: string): Promise<void> => {
    try {
      setModalLoading(true)
      setSelectedCoinId(coinId)
      
      // Prefetch the coin details
      await queryClient.prefetchQuery({
        queryKey: ['coinDetails', coinId],
        queryFn: () => fetchCoinDetails(coinId),
        staleTime: 60000,
      })
      
      // Small delay to ensure data is loaded before showing modal
      setTimeout(() => {
        setModalVisible(true)
        setModalLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error handling coin press:', error)
      setModalLoading(false)
      Alert.alert('Error', 'Failed to load coin details')
    }
  }, [queryClient])

  const closeModal = useCallback((): void => {
    setModalVisible(false)
    setSelectedCoinId(null)
    setModalLoading(false)
  }, [])

  // Search functionality
  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    const dataToSearch = activeTab === 'memes' ? memeCoins : coins
    if (query.trim() === '') {
      setFilteredCoins(dataToSearch)
    } else {
      const filtered = dataToSearch.filter(coin =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredCoins(filtered)
    }
  }

  // Update filtered coins when coins or memeCoins change
  React.useEffect(() => {
    if (activeTab === 'memes') {
      setFilteredCoins(memeCoins)
    } else {
      setFilteredCoins(coins)
    }
    setSearchQuery('') // Reset search when tab changes
  }, [coins, memeCoins, activeTab])

  // Utility functions
  const formatPrice = (price: number): string => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`
    } else if (price < 1) {
      return `$${price.toFixed(4)}`
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    } else {
      return `$${marketCap.toLocaleString()}`
    }
  }

  const toggleWatchlist = (coinId: string): void => {
    setWatchlist(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    )
  }

  const openLink = async (url: string) => {
    try {
      // Ensure URL has proper protocol
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`
      const supported = await Linking.canOpenURL(formattedUrl)
      if (supported) {
        await Linking.openURL(formattedUrl)
      } else {
        Alert.alert('Error', 'Cannot open this link')
      }
    } catch (error) {
      console.error('Error opening link:', error)
      Alert.alert('Error', 'Failed to open link')
    }
  }

  // Memoized watchlist coins
  const watchlistCoins = useMemo(() => 
    coins.filter(coin => watchlist.includes(coin.id)),
    [coins, watchlist]
  )

  // Tab configuration
  const tabs = [
    { key: 'tokens' as TabType, title: 'All Tokens', icon: 'menu' },
    { key: 'trending' as TabType, title: 'Trending', icon: 'trending-up' },
    { key: 'memes' as TabType, title: 'Memes', icon: 'happy' },
    { key: 'watchlist' as TabType, title: 'Watchlist', icon: 'bookmark' },
  ]

  // Render Functions
  const renderCoinItem = ({ item }: { item: Coin }): JSX.Element => {
    const isPositive = item.price_change_percentage_24h >= 0
    const isInWatchlist = watchlist.includes(item.id)
    
    return (
      <TouchableOpacity 
        className="mx-4 mb-4 bg-white rounded-3xl border border-gray-50"
        onPress={() => handleCoinPress(item.id)}
        activeOpacity={0.8}
      >
        <View className="flex-row items-center justify-between p-5">
          <View className="flex-row items-center flex-1">
            <View className="relative mr-4">
              <View className="w-14 h-14 bg-gray-100 rounded-2xl p-1">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-full rounded-xl"
                  resizeMode="contain"
                />
              </View>
              <View className="absolute top-0 right-0 bg-blue-500 border-2 border-white rounded-full px-1.5 py-0.5 min-w-3">
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-white text-[8px] font-bold text-center">
                  {item.market_cap_rank}
                </Text>
              </View>
            </View>
            
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-900 font-bold text-lg" numberOfLines={1}>
                  {item.name}
                </Text>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation()
                    toggleWatchlist(item.id)
                  }}
                  className="p-2 rounded-full bg-gray-50"
                >
                  <Ionicons
                    name={isInWatchlist ? "bookmark" : "bookmark-outline"}
                    size={18}
                    color={isInWatchlist ? "#f59e0b" : "#9ca3af"}
                  />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center">
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-500 text-sm font-semibold uppercase mr-3">
                  {item.symbol}
                </Text>
                <View className="bg-gray-100 rounded-lg px-2 py-1">
                  <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-600 text-xs font-medium">
                    {formatMarketCap(item.market_cap)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="items-end ml-4">
            <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-900 font-bold text-lg mb-1">
              {formatPrice(item.current_price)}
            </Text>
            <View 
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: isPositive ? '#dcfce7' : '#fef2f2'
              }}
            >
              <Ionicons
                name={isPositive ? "trending-up" : "trending-down"}
                size={14}
                color={isPositive ? "#16a34a" : "#dc2626"}
                style={{ marginRight: 4 }}
              />
              <Text
                className="text-sm font-bold"
                style={{
                  color: isPositive ? '#16a34a' : '#dc2626',
                  fontFamily: 'HankenGrotesk_500Medium'
                }}
              >
                {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderTrendingItem = ({ item }: { item: TrendingCoin }): JSX.Element => {
    // Find the coin data for price change
    const coinData = coins.find(coin => coin.id === item.item.id)
    const priceChange = coinData?.price_change_percentage_24h || 0
    const isPositive = priceChange >= 0
    
    return (
      <TouchableOpacity 
        className="mx-4 mb-4 rounded-3xl overflow-hidden"
        activeOpacity={0.8}
        onPress={() => handleCoinPress(item.item.id)}
        style={{
          backgroundColor: 'white',
        }}
      >
        <View className="p-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-14 h-14 bg-gray-200 rounded-2xl p-2 mr-4">
                <Image
                  source={{ uri: item.item.thumb }}
                  className="w-full h-full"
                  resizeMode="contain"
                  style={{borderRadius: 50}}
                />
              </View>
              <View className="flex-1">
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-800 font-bold text-lg mb-1">
                  {item.item.name}
                </Text>
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-purple-400 text-sm font-medium uppercase">
                  {item.item.symbol}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <View className="bg-gray-100 bg-opacity-20 rounded-full px-4 py-2 mb-2">
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-800 font-bold text-sm">🔥 #{item.item.market_cap_rank}</Text>
              </View>
              {coinData && (
                <View 
                  className="flex-row items-center px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: isPositive ? '#dcfce7' : '#fef2f2'
                  }}
                >
                  <Ionicons
                    name={isPositive ? "trending-up" : "trending-down"}
                    size={12}
                    color={isPositive ? "#16a34a" : "#dc2626"}
                    style={{ marginRight: 2 }}
                  />
                  <Text
                    className="text-xs font-bold"
                    style={{
                      color: isPositive ? '#16a34a' : '#dc2626',
                      fontFamily: 'HankenGrotesk_500Medium'
                    }}
                  >
                    {Math.abs(priceChange).toFixed(2)}%
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View className="bg-white bg-opacity-10 rounded-2xl">
            <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-400 text-sm font-medium">
              Trending Now • High Volume • Score: {item.item.score}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderCustomModal = (): JSX.Element => {
    if (!modalVisible) return <></>

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: '75%',
            }}
          >
            {/* Modal Handle */}
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <View
                style={{
                  width: 48,
                  height: 6,
                  backgroundColor: '#d1d5db',
                  borderRadius: 3,
                }}
              />
            </View>

            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {selectedCoin?.image?.large ? (
                  <Image
                    source={{ uri: selectedCoin.image.large }}
                    style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
                  />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#f3f4f6' }} />
                )}
                <View>
                  <Text
                    style={{
                      fontFamily: 'HankenGrotesk_500Medium',
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#111827',
                    }}
                  >
                    {selectedCoin?.name || 'Loading...'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'HankenGrotesk_500Medium',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      fontSize: 14,
                    }}
                  >
                    {selectedCoin?.symbol || ''}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={closeModal} style={{ padding: 8 }}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {coinDetailsLoading || modalLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-500 mt-4 text-lg font-medium">
                  Loading coin details...
                </Text>
              </View>
            ) : selectedCoin ? (
              <ScrollView
                style={{ paddingHorizontal: 24, paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Price Section */}
                <View
                  style={{
                    marginVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'HankenGrotesk_500Medium',
                      fontWeight: 'bold',
                      fontSize: 22,
                      color: '#111827',
                    }}
                  >
                    {formatPrice(selectedCoin.market_data?.current_price?.usd || 0)}
                  </Text>
                  <View
                    style={{
                      backgroundColor: (selectedCoin.market_data?.price_change_percentage_24h || 0) >= 0 ? '#dcfce7' : '#fef2f2',
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 9999,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons
                      name={(selectedCoin.market_data?.price_change_percentage_24h || 0) >= 0 ? 'trending-up' : 'trending-down'}
                      size={18}
                      color={(selectedCoin.market_data?.price_change_percentage_24h || 0) >= 0 ? '#16a34a' : '#dc2626'}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: (selectedCoin.market_data?.price_change_percentage_24h || 0) >= 0 ? '#16a34a' : '#dc2626',
                        fontWeight: 'bold',
                        fontFamily: 'HankenGrotesk_500Medium',
                      }}
                    >
                      {Math.abs(selectedCoin.market_data?.price_change_percentage_24h || 0).toFixed(2)}%
                    </Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 20,
                  }}
                >
                  <View className='flex-row justify-between gap-4 flex-1 mb-4'>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ fontFamily: 'HankenGrotesk_500Medium', color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
                        Market Cap Rank
                      </Text>
                      <TouchableOpacity
                        onPress={() => openLink(`https://www.coingecko.com/en/coins/${selectedCoin.id}`)}
                      >
                        <Text
                          style={{
                            fontFamily: 'HankenGrotesk_500Medium',
                            fontWeight: 'bold',
                            color: '#2563eb',
                            textDecorationLine: 'underline',
                            fontSize: 13,
                          }}
                        >
                          #{selectedCoin.market_cap_rank || 'N/A'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text className='text-right' style={{ fontFamily: 'HankenGrotesk_500Medium', color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
                        24h Volume
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'HankenGrotesk_500Medium',
                          fontWeight: 'bold',
                          color: '#111827',
                          fontSize: 13,
                        }} className='text-right'
                      >
                        {formatMarketCap(selectedCoin.market_data?.total_volume?.usd || 0)}
                      </Text>
                    </View>
                  </View>

                  <View className='flex-row justify-between gap-4 flex-1 mb-4'>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text className='' style={{ fontFamily: 'HankenGrotesk_500Medium', color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
                        Circulating Supply
                      </Text>
                      <Text className=''
                        style={{
                          fontFamily: 'HankenGrotesk_500Medium',
                          fontWeight: 'bold',
                          color: '#111827',
                          fontSize: 13,
                        }}
                      >
                        {(selectedCoin.market_data?.circulating_supply || 0).toLocaleString()}
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text className='text-right' style={{ fontFamily: 'HankenGrotesk_500Medium', color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
                        Market Cap
                      </Text>
                      <TouchableOpacity
                        onPress={() => openLink(`https://www.coingecko.com/en/coins/${selectedCoin.id}`)}
                      >
                        <Text className='text-right'
                          style={{
                            fontFamily: 'HankenGrotesk_500Medium',
                            fontWeight: 'bold',
                            color: '#2563eb',
                            textDecorationLine: 'underline',
                            fontSize: 13,
                          }}
                        >
                          {formatMarketCap(selectedCoin.market_data?.market_cap?.usd || 0)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ fontFamily: 'HankenGrotesk_500Medium', color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
                        All Time High
                      </Text>
                      <Text style={{ fontFamily: 'HankenGrotesk_500Medium', fontWeight: 'bold', color: '#16a34a', fontSize: 12 }}>
                        {formatPrice(selectedCoin.market_data?.ath?.usd || 0)}
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text className='text-right' style={{ fontFamily: 'HankenGrotesk_500Medium', color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
                        All Time Low
                      </Text>
                      <Text className='text-right' style={{ fontFamily: 'HankenGrotesk_500Medium', fontWeight: 'bold', color: '#dc2626', fontSize: 12 }}>
                        {formatPrice(selectedCoin.market_data?.atl?.usd || 0)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Description */}
                {selectedCoin.description?.en && (
                  <View style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        fontFamily: 'HankenGrotesk_500Medium',
                        color: '#111827',
                        fontWeight: 'bold',
                        fontSize: 16,
                        marginBottom: 12,
                      }}
                    >
                      About
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'HankenGrotesk_500Medium',
                        color: '#4b5563',
                        fontSize: 13,
                        lineHeight: 24,
                      }}
                    >
                      {selectedCoin.description.en.replace(/<[^>]*>/g, '').substring(0, 400)}...
                    </Text>
                  </View>
                )}

                {/* Links */}
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontFamily: 'HankenGrotesk_500Medium',
                      color: '#111827',
                      fontWeight: 'bold',
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    Links
                  </Text>

                  <View className='flex-row justify-between item-center gap-4'>
                    {selectedCoin.links?.homepage?.[0] && (
                      <TouchableOpacity
                        className='flex-1 flex-row justify-between item-center gap-2 bg-gray-100 p-4 rounded-lg'
                        onPress={() => openLink(selectedCoin.links.homepage[0])}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} className='items-center gap-2'>
                          <Ionicons name="globe" size={15} color="#3b82f6" />
                          <Text
                            style={{
                              fontFamily: 'HankenGrotesk_500Medium',
                              fontWeight: '600',
                              fontSize: 13,
                            }}
                          >
                            Website
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={15} color="#9ca3af" />
                      </TouchableOpacity>
                    )}

                    {selectedCoin.links?.blockchain_site?.[0] && (
                      <TouchableOpacity
                        className='flex-1 flex-row justify-between item-center gap-2 bg-gray-100 p-4 rounded-lg'
                        onPress={() => openLink(selectedCoin.links.blockchain_site[0])}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} className='items-center gap-2'>
                          <Ionicons name="link" size={15} color="#8b5cf6" />
                          <Text
                            style={{
                              fontFamily: 'HankenGrotesk_500Medium',
                              fontWeight: '600',
                              fontSize: 13,
                            }}
                          >
                            Explorer
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={15} color="#9ca3af" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </ScrollView>
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-500 text-lg font-medium">
                  Failed to load coin details
                </Text>
                <TouchableOpacity onPress={closeModal} className="mt-4 bg-blue-500 px-6 py-3 rounded-full">
                  <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-white font-semibold">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    )
  }

  const renderTabContent = (): JSX.Element => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-500 mt-4 text-lg font-medium">Loading crypto data...</Text>
        </View>
      )
    }

    switch (activeTab) {
      case 'tokens':
        return (
          <FlatList
            data={filteredCoins}
            keyExtractor={(item) => item.id}
            renderItem={renderCoinItem}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <View className="bg-gray-100 rounded-full p-6 mb-4">
                  <Ionicons name="search" size={48} color="#9ca3af" />
                </View>
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-600 text-xl font-bold mb-2">No tokens found</Text>
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-400 text-base text-center px-8 leading-6">
                  Try adjusting your search terms to find cryptocurrencies
                </Text>
              </View>
            }
          />
        )
      
      case 'trending':
        return (
          <FlatList
            data={trendingCoins}
            keyExtractor={(item) => item.item.id}
            renderItem={renderTrendingItem}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
          />
        )
      
      case 'memes':
        return (
          <FlatList
            data={filteredCoins}
            keyExtractor={(item) => item.id}
            renderItem={renderCoinItem}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <View className="bg-gray-100 rounded-full p-6 mb-4">
                  <Text className="text-4xl">🚀</Text>
                </View>
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-600 text-xl font-bold mb-2">No meme coins found</Text>
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-400 text-base text-center px-8 leading-6">
                  Meme coins are loading... To the moon! 🌙
                </Text>
              </View>
            }
          />
        )
      
      case 'watchlist':
        return (
          <FlatList
            data={watchlistCoins}
            keyExtractor={(item) => item.id}
            renderItem={renderCoinItem}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <View className="bg-gray-100 rounded-full p-6 mb-4">
                  <Ionicons name="bookmark-outline" size={48} color="#f59e0b" />
                </View>
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-600 text-xl font-bold mb-2">Your watchlist is empty</Text>
                <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-400 text-base text-center px-8 leading-6">
                  Tap the bookmark icon on any cryptocurrency to add it to your watchlist
                </Text>
              </View>
            }
          />
        )
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <LoadingOverlay visible={coinDetailsLoading}/>
      
      {/* Header */}
      <View className="bg-white pb-6 pt-4">
        <View className="px-6 mb-6">
          <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-900 text-2xl font-bold mb-1">Crypto Explorer</Text>
          <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className="text-gray-500 text-base">
            Discover and track cryptocurrencies in real-time
          </Text>
        </View>

        {/* Enhanced Search Bar */}
        {(activeTab === 'tokens' || activeTab === 'memes') && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-2 border border-gray-100">
              <Ionicons name="search" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                placeholder={activeTab === 'memes' ? "Search meme coins..." : "Search cryptocurrencies..."}
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => handleSearch('')}
                  className="ml-2 p-1"
                >
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <View className="flex-row gap-3 space-x-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  className="px-4 py-2 rounded-full flex-row items-center border"
                  style={{
                    backgroundColor: isActive ? '#3b82f6' : '#ffffff',
                    borderColor: isActive ? '#3b82f6' : '#e5e7eb',
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={tab.icon as any}
                    size={15}
                    color={isActive ? '#ffffff' : '#6b7280'}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className="font-semibold text-sm"
                    style={{
                      color: isActive ? '#ffffff' : '#6b7280',
                      fontFamily: 'HankenGrotesk_500Medium'
                    }}
                  >
                    {tab.title}
                  </Text>
                  {tab.key === 'watchlist' && watchlist.length > 0 && (
                    <View 
                      className="ml-2 px-2 py-1 rounded-full min-w-6"
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#dbeafe'
                      }}
                    >
                      <Text 
                        className="text-xs font-bold text-center"
                        style={{
                          color: isActive ? '#ffffff' : '#3b82f6',
                          fontFamily: 'HankenGrotesk_500Medium'
                        }}
                      >
                        {watchlist.length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {renderTabContent()}
      {renderCustomModal()}
    </SafeAreaView>
  )
}

export default Explore