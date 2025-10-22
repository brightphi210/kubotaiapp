import { SolidMainButton } from '@/components/Btns'
import Header from '@/components/Header'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useGetTask } from '@/hooks/queries/allQueries'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const Tasks = () => {

  const {getTask, isLoading} = useGetTask()
  const allTask = getTask?.data.data
  console.log('This is Task', allTask)
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showBottomSheet, setShowBottomSheet] = useState(false)

  const [completedTasks, setCompletedTasks] = useState([
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
      date: 'Oct 17, 2025',
      time: '11:20 AM',
      title: 'Product Review Task',
      tokens: 100
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
      date: 'Oct 16, 2025',
      time: '3:00 PM',
      title: 'Social Media Engagement',
      tokens: 75
    }
  ])

  const [taskCompleted, setTaskCompleted] = useState(false)

  const handleTaskPress = (task: any) => {
    setSelectedTask(task)
    setTaskCompleted(false)
    setShowBottomSheet(true)
  }

  const handlePerformTask = () => {
    setTaskCompleted(true)
  }

  const handleClaimTokens = () => {
    if (selectedTask) {
      const completedTask = {
        ...selectedTask,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }
      
      setCompletedTasks([completedTask, ...completedTasks])
      setShowBottomSheet(false)
      setSelectedTask(null)
    }
  }

  const totalTokensAvailable = allTask?.reduce((sum:any, task:any) => sum + task.reward_tokens, 0)

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style='light'/> 
      <Header text='Tasks'/>
      <LoadingOverlay visible={isLoading}/>

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
                <Text className='text-xl text-yellow-400' style={{ fontFamily: 'HankenGrotesk_700Bold'}}>
                  KU
                </Text>
              </View>
            </View>
          </View>
          
          <View className='flex-row items-center'>
            <View className='flex-1 h-2 bg-white/20 rounded-full overflow-hidden'>
              <View 
                style={{ 
                  width: completedTasks.length > 0 ? `${(completedTasks.length / (allTask && allTask.length + completedTasks.length)) * 100}%` : '0%',
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

      <ScrollView className='px-6 pt-5' showsVerticalScrollIndicator={false}>
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
              allTask.map((task: any) => (
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
              completedTasks.map((task, index) => (
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
                        className='flex items-center gap-4 bg-green-800 p-4 py-5 w-full rounded-lg'
                      >
                        <Text className='text-white text-[13px]' style={{ fontFamily: 'HankenGrotesk_700Bold'}}>
                          🪙 Claim {selectedTask.tokens} KU Tokens
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
    </View>
  )
}

export default Tasks