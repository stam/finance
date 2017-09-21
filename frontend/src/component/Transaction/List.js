import styled from 'styled-components';

export const List = styled.div`
    width: 100%;
    border-top: 1px solid #444;
`;

export const EntryItem = styled.div`
    display: flex;
    width: 100%;
    flex-flow: row wrap;
    align-items: center;
    border-bottom: 1px solid #444;
    padding: 10px;
`;

export const DateHeader = styled.div`
    color: #aaa;
    font-size: 14px;
    margin: 20px 0 0 5px;
`;

export const EntryItemDescription = styled.div`
    font-weight: bold;
    flex: 3;
`;

export const EntryItemProject = styled.div`
    flex: 1;
`;

export const EntryItemTime = styled.div`
    flex: 1;
    text-align: center;
`;

export const EntryItemActions = styled.div`
    align-self: flex-end;
`;
