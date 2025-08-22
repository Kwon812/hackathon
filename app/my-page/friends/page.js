'use client'
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiChevronLeft, FiUser } from 'react-icons/fi';
import {useRouter} from "next/navigation";


const mockFriends = [
    { id: 1, name: '홍길동', stamps: 45 },
    { id: 2, name: '전우치', stamps: 1 },
    { id: 3, name: '김데이트', stamps: 45 },
    { id: 4, name: '아무개', stamps: 45 },
];

const mockRequests = [
    { id: 5, name: '테스트' },
    { id: 6, name: '나서스' },
    { id: 7, name: '트레이서' },
    { id: 8, name: '윈스턴' },
];


export default function FriendScreen() {

    const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'

    const router=useRouter()
    const handleAction = (message) => {
        alert(message);
    };

    return (
        <Container>
            <Header>
                <BackButton onClick={()=>router.push('/my-page')} >
                    <FiChevronLeft size={28} />
                </BackButton>
                <Title>친구 관리</Title>
                <DoneButton onClick={()=>router.push('/my-page')}>완료</DoneButton>
            </Header>

            <TabContainer>
                <TabButton
                    $active={activeTab === 'friends'}
                    onClick={() => setActiveTab('friends')}
                >
                    친구 목록 ({mockFriends.length})
                </TabButton>
                <TabButton
                    $active={activeTab === 'requests'}
                    onClick={() => setActiveTab('requests')}
                >
                    요청 받음 ({mockRequests.length})
                </TabButton>
            </TabContainer>

            {activeTab === 'friends' ? (
                <FriendList>
                    <SectionTitle>친구 목록</SectionTitle>
                    {mockFriends.map(friend => (
                        <FriendItem key={friend.id}>
                            <ProfileIcon><FiUser size={20} /></ProfileIcon>
                            <FriendInfo>
                                <FriendName>{friend.name}</FriendName>
                                <StampCount>스탬프 {friend.stamps}개</StampCount>
                            </FriendInfo>
                            <DeleteButton onClick={() => handleAction(`${friend.name}님을 삭제했습니다.`)}>삭제</DeleteButton>
                        </FriendItem>
                    ))}
                </FriendList>
            ) : (
                <FriendList>
                    <SectionTitle>친구 요청</SectionTitle>
                    {mockRequests.map(request => (
                        <FriendItem key={request.id}>
                            <ProfileIcon><FiUser size={20} /></ProfileIcon>
                            <FriendInfo>
                                <FriendName>{request.name}</FriendName>
                            </FriendInfo>
                            <ActionButtons>
                                <DeclineButton onClick={() => handleAction(`${request.name}님의 요청을 거절했습니다.`)}>거절</DeclineButton>
                                <ApproveButton onClick={() => handleAction(`${request.name}님의 요청을 승인했습니다.`)}>승인</ApproveButton>
                            </ActionButtons>
                        </FriendItem>
                    ))}
                </FriendList>
            )}

        </Container>
    );
};

// --- Styled Components ---

const Container = styled.div`
  padding: 20px;
  background-color: #FFFFFF;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  //padding-top: 10px/;
`;

const BackButton = styled.a`
  color: ${({ theme }) => theme.colors.black};
`;

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`;

const DoneButton = styled.a`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
`;

const TabContainer = styled.div`
  display: flex;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.white : theme.colors.gray};
  transition: all 0.2s ease-in-out;
`;

const FriendList = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 10px;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

const FriendInfo = styled.div`
  flex-grow: 1;
`;

const FriendName = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
`;

const StampCount = styled.p`
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const BaseButton = styled.button`
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
`;

const DeleteButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.chipRed};
  color: white;
`;

const DeclineButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.black};
`;

const ApproveButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
`;
