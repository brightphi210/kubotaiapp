import { SolidMainButton } from '@/components/Btns'
import Header from '@/components/Header'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useClaimToken } from '@/hooks/mutation/allMutation'
import { useGetCompletedTask, useGetTask } from '@/hooks/queries/allQueries'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Image, Modal, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'

// Define types
interface Task {
  id: string | number
  images: string
  title: string
  description: string
  category: string
  duration: string
  reward_tokens: number
  created_at: string
}

interface CompletedTask {
  id: string | number
  image: string
  date: string
  time: string
  title: string
  tokens: number
  category: string
  created_at: string
}

type TabType = 'active' | 'completed'

const Tasks = () => {
  const { getTask, isLoading, refetch: refetchTasks } = useGetTask()
  const allTask: Task[] | undefined = getTask?.data.data
  const { getCompletedTask, isLoading: completedtaskLoading, refetch: refetchCompletedTasks } = useGetCompletedTask()
  const completedTasksFromAPI: CompletedTask[] = getCompletedTask?.data?.data || []
  
  console.log('This is Task', allTask)
  const [activeTab, setActiveTab] = useState<TabType>('active')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { mutate, isPending } = useClaimToken(selectedTask?.id)
  
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [claimedTokens, setClaimedTokens] = useState<number>(0)
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([])
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  // Sync completed tasks from API
  useEffect(() => {
    if (completedTasksFromAPI && completedTasksFromAPI.length > 0) {
      setCompletedTasks(completedTasksFromAPI)
    }
  }, [completedTasksFromAPI])

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        refetchTasks(),
        refetchCompletedTasks()
      ])
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task)
    setTaskCompleted(false)
    setShowBottomSheet(true)
  }

  const handlePerformTask = () => {
    setTaskCompleted(true)
  }

  const handleClaimTokens = () => {
    if (selectedTask) {
      // Call the mutation to claim tokens
      mutate(undefined, {
        onSuccess: (response: any) => {
          console.log('Token claimed successfully:', response)
          
          // Create completed task object
          const completedTask: CompletedTask = {
            id: selectedTask.id,
            image: selectedTask.images,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            title: selectedTask.title,
            tokens: selectedTask.reward_tokens,
            category: selectedTask.category,
            created_at: selectedTask.created_at
          }
          
          // Update completed tasks
          setCompletedTasks([completedTask, ...completedTasks])
          
          // Store claimed tokens for success modal
          setClaimedTokens(selectedTask.reward_tokens)
          
          // Close bottom sheet and show success modal
          setShowBottomSheet(false)
          setShowSuccessModal(true)
          setSelectedTask(null)
          
          // Auto close success modal after 3 seconds
          setTimeout(() => {
            setShowSuccessModal(false)
          }, 3000)
        },
        onError: (error: any) => {
          console.error('Error claiming token:', error)
          alert('Failed to claim tokens. Please try again.')
        }
      })
    }
  }

  const totalTokensAvailable: number = allTask?.reduce((sum: number, task: Task) => sum + Number(task.reward_tokens), 0) || 0
  const totalTokensEarned: number = completedTasks.reduce((sum: number, task: CompletedTask) => sum + (task.tokens || 0), 0)

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style='light'/> 
      <Header text='Tasks'/>
      <LoadingOverlay visible={isLoading || isPending}/>

      {/* Stats Card */}
      <View className='mx-6 mt-4 mb-4'>
        <View 
          className='rounded-2xl p-5 overflow-hidden bg-[#011730]'
        >
          <View className='flex-row justify-between items-center mb-3'>
            <View>
              <Text className='text-xs text-gray-300' style={{ fontFamily: 'HankenGrotesk_400Regular'}}>
                Available Tasks
              </Text>
              <Text className='text-xl text-white' style={{ fontFamily: 'HankenGrotesk_700Bold' }}>
                {allTask && allTask?.length}
              </Text>
            </View>
            <View className='items-end'>
              <Text className='text-xs text-gray-300' style={{ fontFamily: 'HankenGrotesk_400Regular'}}>
                Total Rewards
              </Text>
              <View className='flex-row items-center mt-1'>
                <Text className='text-xl text-yellow-400' style={{ fontFamily: 'HankenGrotesk_700Bold'}}>
                  {totalTokensAvailable}
                </Text>
                <Text className='text-xl text-yellow-400 ml-1' style={{ fontFamily: 'HankenGrotesk_700Bold'}}>
                  KU
                </Text>
              </View>
            </View>
          </View>
          
          {/* Earned Tokens Section */}
          <View className='mb-3 pt-3 border-t border-white/10'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-xs text-gray-300' style={{ fontFamily: 'HankenGrotesk_400Regular'}}>
                Tokens Earned
              </Text>
              <View className='flex-row items-center'>
                <Text className='text-base text-green-400' style={{ fontFamily: 'HankenGrotesk_700Bold'}}>
                  {totalTokensEarned}
                </Text>
                <Text className='text-base text-green-400 ml-1' style={{ fontFamily: 'HankenGrotesk_700Bold'}}>
                  KU
                </Text>
              </View>
            </View>
          </View>
          
          <View className='flex-row items-center'>
            <View className='flex-1 h-2 bg-white/20 rounded-full overflow-hidden'>
              <View 
                style={{ 
                  width: completedTasks.length > 0 ? `${(completedTasks.length / ((allTask?.length || 0) + completedTasks.length)) * 100}%` : '0%',
                  height: '100%',
                  backgroundColor: '#FCD34D',
                  borderRadius: 999
                }}
              />
            </View>
            <Text className='text-xs text-gray-300' style={{ fontFamily: 'HankenGrotesk_400Regular', marginLeft: 20 }}>
              {completedTasks.length} completed
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className='px-6 flex-row gap-3 mb-4'>
        <TouchableOpacity 
          onPress={() => setActiveTab('active')}
          className='flex-1 py-3 rounded-lg items-center'
          style={{ 
            backgroundColor: activeTab === 'active' ? '#DEECFD' : '#FFFFFF',
          }}
        >
          <Text 
            style={{ 
              fontFamily: 'HankenGrotesk_700Bold',
              color: activeTab === 'active' ? '#016FEC' : '#6B7280',
            }}
            className='text-sm'
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('completed')}
          className='flex-1 py-3 rounded-lg items-center'
          style={{ 
            backgroundColor: activeTab === 'completed' ? '#DEECFD' : '#FFFFFF',
          }}
        >
          <Text 
            className='text-sm'
            style={{ 
              fontFamily: 'HankenGrotesk_700Bold',
              color: activeTab === 'completed' ? '#016FEC' : '#6B7280',
            }}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className='px-6 pt-5' 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#016FEC"
            colors={["#016FEC"]}
          />
        }
      >
        {activeTab === 'active' ? (
          <>
            {allTask === undefined || allTask.length === 0 ? (
              <View className='items-center justify-center py-20'>
                <View className='justify-center mt-10 m-auto'>
                  <MaterialIcons name='dataset' size={25} color={'gray'} style={{margin: 'auto'}}/>
                  <Text className='text-sm text-center text-gray-500'>No active tasks available</Text>
                </View>
                <Text style={{ fontFamily: 'HankenGrotesk_400Regular', color: '#D1D5DB', fontSize: 14, marginTop: 4 }}>
                  Check back later for new tasks
                </Text>
              </View>
            ) : (
              allTask.map((task: Task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => handleTaskPress(task)}
                  activeOpacity={0.9}
                >
                  <View 
                    className='bg-white rounded-lg p-4 mb-4 border border-gray-100'
                  >
                    <View className='flex-row items-start mb-3'>
                      <View style={{ position: 'relative' }}>
                        <Image 
                          source={{ uri: task.images }}
                          style={{ 
                            width: 60, 
                            height: 60, 
                            borderRadius: 8, 
                            backgroundColor: '#E5E7EB'
                          }}
                        />
                      </View>

                      <View className='flex-1 ml-3'>
                        <View className='flex-row items-center justify-between mb-1'>
                          <View className='px-2 py-0.5 rounded bg-blue-50 mr-2'>
                            <Text style={{ 
                              fontFamily: 'HankenGrotesk_600SemiBold', 
                              color: '#3B82F6', 
                              fontSize: 10 
                            }}>
                              {task.category}
                            </Text>
                          </View>
                          <Text className='text-xs text-gray-400' style={{ fontFamily: 'HankenGrotesk_500Medium' }}>
                            {task.duration}
                          </Text>
                        </View>
                        <Text className='text-base' style={{ fontFamily: 'HankenGrotesk_700Bold', color: '#111827' }}>
                          {task.title}
                        </Text>
                        <Text className='text-sm text-gray-500' style={{ fontFamily: 'HankenGrotesk_400Regular' }} numberOfLines={2}>
                          {task.description.slice(0, 40)}...
                        </Text>
                      </View>

                      <Text className='ml-auto text-xs absolute right-0 text-gray-500' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                        {new Date(task.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                     </Text>
                    </View>

                    <View 
                      className='flex-row items-center justify-between rounded-xl border-t border-gray-100 pt-2'
                    >
                      <View className='flex-row items-center'>
                        <Text style={{ fontSize: 14, marginRight: 6 }}>🪙</Text>
                        <View>
                          <Text className='text-base text-green-800' style={{ fontFamily: 'HankenGrotesk_600SemiBold' }}>
                            +{task.reward_tokens} KU
                          </Text>
                        </View>
                      </View>
                      
                      <View 
                        className='p-2 rounded-md flex-row justify-center items-center gap-2 bg-[#016FEC]'
                      >
                        <Ionicons name='arrow-forward' size={13} color={'white'}/>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        ) : (
          <>
            {completedTasks.length === 0 ? (
              <View className='items-center justify-center py-20'>
                <View className='w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4'>
                  <Text style={{ fontSize: 40 }}>✅</Text>
                </View>
                <Text style={{ fontFamily: 'HankenGrotesk_600SemiBold', color: '#9CA3AF', fontSize: 16 }}>
                  No completed tasks yet
                </Text>
                <Text style={{ fontFamily: 'HankenGrotesk_400Regular', color: '#D1D5DB', fontSize: 14, marginTop: 4 }}>
                  Complete tasks to earn tokens
                </Text>
              </View>
            ) : (
              completedTasks.map((task: CompletedTask, index: number) => (
                <View 
                  key={task.id}
                  className='bg-white rounded-2xl p-4 mb-4 flex-row items-center'
                  style={{ 
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: '#F3F4F6'
                  }}
                >
                  <View className='relative'>
                    <Image 
                      source={{ uri: task.image }}
                      style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#E5E7EB' }}
                    />
                    <View 
                      className='absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center'
                      style={{ backgroundColor: '#10B981' }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 14 }}>✓</Text>
                    </View>
                  </View>

                  <View className='flex-1 ml-3'>
                    <Text className='text-base mb-0.5' style={{ fontFamily: 'HankenGrotesk_700Bold', color: '#111827' }} numberOfLines={1}>
                      {task.title}
                    </Text>
                    <Text className='text-xs text-gray-400 mb-1' style={{ fontFamily: 'HankenGrotesk_500Medium' }}>
                      {task.date} • {task.time}
                    </Text>
                    <View className='flex-row items-center'>
                      <View className='px-2 py-0.5 rounded bg-green-50'>
                        <Text style={{ fontFamily: 'HankenGrotesk_600SemiBold', color: '#10B981', fontSize: 10 }}>
                          CLAIMED
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className='items-end'>
                    <View 
                      className='px-3 py-1.5 rounded-lg'
                      style={{ backgroundColor: '#DCFCE7' }}
                    >
                      <Text className='text-base' style={{ fontFamily: 'HankenGrotesk_700Bold', color: '#16A34A' }}>
                        +{task.tokens}
                      </Text>
                      <Text className='text-xs' style={{ fontFamily: 'HankenGrotesk_600SemiBold', color: '#16A34A' }}>
                        KU
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>


      {/* Enhanced Bottom Sheet Modal */}
      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <Pressable 
          className='flex-1 justify-end'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onPress={() => setShowBottomSheet(false)}
        >
          <Pressable 
            className='bg-white rounded-t-xl'
            style={{ maxHeight: '85%' }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className='items-center py-4'>
              <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2 }} />
            </View>

            <ScrollView className='px-6 pb-6' showsVerticalScrollIndicator={false}>
              {selectedTask && (
                <>
                  <View className=' mb-6 '>
                    <View className='flex-row gap-4' >
                      <Image 
                        source={{ uri: selectedTask.images }}
                        style={{ 
                          width: 45, 
                          height: 45, 
                          borderRadius: 6, 
                        }}
                      />
                     
                     <View>
                        <Text className='text-lg' style={{ fontFamily: 'HankenGrotesk_700Bold', color: '#111827' }}>
                          {selectedTask.title}
                        </Text>
                        {selectedTask.category && (
                          <View className='flex-row'>
                            <View className='px-3 py-1 rounded-full bg-blue-50'>
                              <Text className='text-xs' style={{ fontFamily: 'HankenGrotesk_600SemiBold', color: '#3B82F6' }}>
                                {selectedTask.category}
                              </Text>
                            </View>
                          </View>
                        )}
                     </View>

                     <Text className='ml-auto text-xs text-gray-500' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                        {new Date(selectedTask.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                     </Text>
                    </View>
                      <Text className='text-sm pt-4 leading-normal text-gray-600' style={{ fontFamily: 'HankenGrotesk_400Regular' }}>
                        {selectedTask.description}
                      </Text>
                  </View>

                  {!taskCompleted ? (
                    <>
                      <View className='bg-blue-50 rounded-xl p-4 mb-4'>
                        <Text className='text-xs text-blue-900 text-center' style={{ fontFamily: 'HankenGrotesk_500Medium' }}>
                          💡 Complete the task to unlock your reward.
                        </Text>
                      </View>

                      <SolidMainButton onPress={handlePerformTask} text='Perform Task'/>
                    </>
                  ) : (
                    <>
                      <View 
                        className='rounded-2xl bg-green-50 p-2 mb-4'
                      >
                        <View className='items-center'>
                          <Text style={{ fontSize: 20, marginBottom: 8 }}>🎉</Text>
                          <Text className='text-sm text-green-800 text-center' style={{ fontFamily: 'HankenGrotesk_700Bold' }}>
                            Task Completed!
                          </Text>
                          <Text className='text-xs text-green-700 text-center mt-2' style={{ fontFamily: 'HankenGrotesk_500Medium' }}>
                            Amazing work! Your tokens are ready to claim
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity 
                        onPress={handleClaimTokens}
                        disabled={isPending}
                        className='flex items-center gap-4 bg-green-800 p-4 py-5 w-full rounded-lg'
                        style={{ opacity: isPending ? 0.6 : 1 }}
                      >
                        <Text className='text-white text-[13px]' style={{ fontFamily: 'HankenGrotesk_700Bold'}}>
                          {isPending ? 'Claiming...' : `🪙 Claim ${selectedTask.reward_tokens} KU Tokens`}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View 
          className='flex-1 justify-center items-center'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <View 
            className='bg-white rounded-3xl p-8 mx-8 items-center'
            style={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
              maxWidth: 350,
              width: '100%'
            }}
          >
            <View 
              className='w-20 h-20 rounded-full items-center justify-center mb-4'
              style={{ backgroundColor: '#DCFCE7' }}
            >
              <Text style={{ fontSize: 48 }}>🎉</Text>
            </View>
            
            <Text 
              className='text-2xl text-center mb-2'
              style={{ fontFamily: 'HankenGrotesk_700Bold', color: '#111827' }}
            >
              Success!
            </Text>
            
            <Text 
              className='text-sm text-center text-gray-600 mb-4'
              style={{ fontFamily: 'HankenGrotesk_400Regular' }}
            >
              You've successfully claimed your tokens
            </Text>
            
            <View 
              className='bg-green-50 rounded-2xl p-4 w-full items-center mb-4'
            >
              <Text 
                className='text-xs text-green-700 mb-1'
                style={{ fontFamily: 'HankenGrotesk_500Medium' }}
              >
                Tokens Earned
              </Text>
              <View className='flex-row items-center'>
                <Text 
                  className='text-3xl text-green-800'
                  style={{ fontFamily: 'HankenGrotesk_700Bold' }}
                >
                  +{claimedTokens}
                </Text>
                <Text 
                  className='text-2xl text-green-800 ml-2'
                  style={{ fontFamily: 'HankenGrotesk_700Bold' }}
                >
                  KU
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => setShowSuccessModal(false)}
              className='bg-green-600 rounded-xl py-3 px-8 w-full items-center'
            >
              <Text 
                className='text-white text-base'
                style={{ fontFamily: 'HankenGrotesk_700Bold' }}
              >
                Awesome!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Tasks