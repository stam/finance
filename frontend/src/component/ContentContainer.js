import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
    flex: 1;
    overflow: scroll;
`;

const Main = styled.main`
    margin: 0 auto;
    max-width: 800px;
    padding: 16px;
`;

const ContentContainer = ({ children }) =>
    <Container>
        <Main>
            {children}
        </Main>
    </Container>;

ContentContainer.propTypes = {
    children: PropTypes.node,
};

export default ContentContainer;
