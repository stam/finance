import styled from 'styled-components';

export const Account = styled.div`
    position: relative;
    display: flex;

    &:hover > div {
        display: flex;
    }
`;

export const AccountDisplay = styled.div`
    flex; 1;
    display: flex;
    align-items: center;
    padding: 0 16px;
`;

export const AccountAvatar = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-top: 16px;
`;

export const AccountContent = styled.div`
    top: 100%;
    width: 100%;
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    background: #222;
    padding: 4px 0 8px;
    border-radius: 0 0 8px 8px;

    display: none;
`;

export const AccountItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 16px 8px;
`;
