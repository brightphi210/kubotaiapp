import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { useState } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Task = () => {
  const [activeTab, setActiveTab] = useState(true)
  const [completedTab, setCompletedTab] = useState(false)
  
  // Active tasks data
  const activeTasks = [
    { id: 1, title: 'Join Tonstation', reward: 5000, status: 'claim', type: 'social', icon: 'group' },
    { id: 2, title: 'Follow on Twitter', reward: 2500, status: 'join', type: 'social', icon: 'campaign' },
    { id: 3, title: 'Join Telegram', reward: 5000, status: 'claim', type: 'social', icon: 'chat' },
    { id: 4, title: 'Share with Friends', reward: 1000, status: 'claim', type: 'referral', icon: 'share' },
    { id: 5, title: 'Complete Daily Check-in', reward: 500, status: 'join', type: 'daily', icon: 'check-circle' },
    { id: 6, title: 'Watch Tutorial Video', reward: 3000, status: 'join', type: 'education', icon: 'play-circle-filled' },
  ]
  
  // Completed tasks data  
  const completedTasks = [
    { id: 7, title: 'Download App', reward: 1000, status: true, type: 'onboarding', icon: 'download' },
    { id: 8, title: 'Create Account', reward: 2000, status: true, type: 'onboarding', icon: 'person-add' },
    { id: 9, title: 'Verify Email', reward: 1500, status: true, type: 'onboarding', icon: 'email' },
    { id: 10, title: 'First Login', reward: 1000, status: true, type: 'milestone', icon: 'login' },
    { id: 11, title: 'Profile Setup', reward: 2500, status: true, type: 'onboarding', icon: 'person' },
  ]

  // Active task handlers
  const handleActiveTaskJoin = (taskId: number) => {
    console.log(`Active Task ${taskId} - Action: Join`)
    // Add your join logic here
  }

  const handleActiveTaskClaim = (taskId: number) => {
    console.log(`Active Task ${taskId} - Action: Claim`)
    // Add your claim logic here
  }

  // Completed task handler
  const handleCompletedTaskView = (taskId: number) => {
    console.log(`Completed Task ${taskId} - Action: View`)
    // Add your view logic here
  }

  // Active Task Item Component
  const ActiveTaskItem = ({ task }: { task: any }) => (
    <View className="flex-row items-center justify-between py-4 mb-5 bg-neutral-950 rounded-xl border-b border-neutral-900">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-black rounded-lg mr-3 justify-center items-center">
          <MaterialIcons name={task.icon as any} size={20} color={'white'} />
        </View>
        
        <View className="flex-1">
          <Text className="text-white text-base font-medium mb-1" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
            {task.title}
          </Text>
          <Text className="text-neutral-400 text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            +{task.reward.toLocaleString()} Kubot
          </Text>
        </View>
      </View>
      
      {task.status === 'join' ? (
        <TouchableOpacity
          onPress={() => handleActiveTaskJoin(task.id)}
          className="px-6 py-2 rounded-full bg-blue-500"
        >
          <Text 
            className="text-sm font-medium text-white"
            style={{fontFamily: 'HankenGrotesk_500Medium'}}
          >
            Join
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handleActiveTaskClaim(task.id)}
          className="px-6 py-2 rounded-full bg-transparent border border-blue-500"
        >
          <Text 
            className="text-sm font-medium text-blue-500"
            style={{fontFamily: 'HankenGrotesk_500Medium'}}
          >
            Claim
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )

  // Completed Task Item Component
  const CompletedTaskItem = ({ task }: { task: any }) => (
    <View className="flex-row items-center justify-between py-4 mb-5 bg-neutral-950 rounded-xl border-b border-neutral-900">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-green-900 rounded-lg mr-3 justify-center items-center">
          <MaterialIcons name={task.icon as any} size={20} color={'#22c55e'} />
        </View>
        
        <View className="flex-1">
          <Text className="text-white text-base font-medium mb-1" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
            {task.title}
          </Text>
          <Text className="text-green-400 text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            +{task.reward.toLocaleString()} Kubot Earned
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={() => handleCompletedTaskView(task.id)}
        className="px-6 py-2 rounded-full bg-gray-600"
      >
        <Text 
          className="text-sm font-medium text-gray-300"
          style={{fontFamily: 'HankenGrotesk_500Medium'}}
        >
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0a0a0a' }}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="py-8 pt-12">
          <Text className="text-2xl font-bold text-white text-center mb-3" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            Task
          </Text>
          <Text className="text-neutral-400 text-center text-lg leading-6" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            Get Rewarded for{'\n'}Completing a task
          </Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row justify-between gap-3 mb-4 bg-neutral-900 rounded-2xl p-1.5 border border-neutral-800">
          <TouchableOpacity
              onPress={() => {setActiveTab(true); setCompletedTab(false)}}
              className={`py-4 rounded-xl flex-1`}
              style={{backgroundColor: activeTab ? '#016FEC' : '#1A1A1A'}}
              // className={`py-4 rounded-xl ${activeTab === true && 'bg-[#016FEC] shadow-lg'}`}
              
            >
              <Text 
                className={`text-center font-semibold text-base ${
                  activeTab === true ? 'text-white' : 'text-neutral-400'
                }`}
                style={{fontFamily: 'HankenGrotesk_600SemiBold'}}
              >
                Active
              </Text>
          </TouchableOpacity>

          <TouchableOpacity
              onPress={() => {setCompletedTab(true); setActiveTab(false)}}
              className={`py-4 rounded-xl flex-1`}
              style={{backgroundColor: completedTab === true ? '#016FEC' : '#1A1A1A'}}
              // className={`py-4 rounded-xl ${completedTab === true && 'bg-[#016FEC] shadow-lg'}`}
            >
              <Text 
                className={`text-center font-semibold text-base ${
                  completedTab === true ? 'text-white' : 'text-neutral-400'
                }`}
                style={{fontFamily: 'HankenGrotesk_600SemiBold'}}
              >
                Completed
              </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === true && (
          <View>
            {/* Active Task Stats Banner */}
            <View className="bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-3 mb-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-green-500 text-2xl text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                    {activeTasks.filter(t => t.status === 'claim').length}
                  </Text>
                  <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    Ready to Claim
                  </Text>
                </View>
                <View>
                  <Text className="text-green-500 text-2xl text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                    {activeTasks.filter(t => t.status === 'join').length}
                  </Text>
                  <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    Available Tasks
                  </Text>
                </View>
                <View>
                  <Text className="text-green-500 text-lg text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                    {activeTasks.reduce((sum, task) => sum + task.reward, 0).toLocaleString()}
                  </Text>
                  <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    Total Rewards
                  </Text>
                </View>
              </View>
            </View>

            {/* Active Task List */}
            <View className="pb-6">
              {activeTasks.map((task) => (
                <ActiveTaskItem key={task.id} task={task} />
              ))}
            </View>
          </View>
        )}
        {completedTab === true && (
          <View>
              <View className="bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-3 mb-4">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-green-500 text-2xl text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                      {completedTasks.length}
                    </Text>
                    <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                      Tasks Completed
                    </Text>
                  </View>
                  <View>
                    <Text className="text-green-500 text-lg text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                      {completedTasks.reduce((sum, task) => sum + task.reward, 0).toLocaleString()}
                    </Text>
                    <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                      Total Earned
                    </Text>
                  </View>
                  <View>
                    <Text className="text-green-500 text-lg text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                      {Math.round(completedTasks.reduce((sum, task) => sum + task.reward, 0) / completedTasks.length).toLocaleString()}
                    </Text>
                    <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                      Avg. Reward
                    </Text>
                  </View>
                </View>
              </View>

              {/* Completed Task List */}
              <View className="pb-6">
                {completedTasks.map((task) => (
                  <CompletedTaskItem key={task.id} task={task} />
                ))}
              </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

export default Task