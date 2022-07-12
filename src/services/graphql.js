import { gql} from '@apollo/client';


export const GET_FOR_APPROVAL_COINS = gql`
    query GetForApprovalCoins {
        ForApprovalCoins {
            CoinID
            Name
            Chain
            Symbol
            ContractAddress
            LaunchDate
            IsPresale
            IsDoxxed
            Description
            AuditLink
            Website
            Telegram
            Twitter
            Discord
            LogoLink
            Status
            ContactEmail
            createdAt
            updatedAt
        }
    }
`;

export const GET_COINS = gql`
    query GetCoins($offset: Int!){
        Coins(limit: 100, offset: $offset){
            CoinID
            Name
            Chain
            Symbol
            ContractAddress
            LaunchDate
            IsPresale
            IsDoxxed
            Description
            AuditLink
            Website
            Telegram
            Twitter
            Discord
            LogoLink
            VoteToday
            AllTimeVote
            IsUpvoted
            Status
        }
    }
`;
export const GET_COIN_BY_NAME_ADDRESS = gql`
    query GetCoinByNameOrAddress($name: String, $contractAddress: String) {
        CoinByNameOrAddress(Name: $name, ContractAddress: $contractAddress) {
            CoinID
            Name
            Chain
            Symbol
            ContractAddress
            LaunchDate
            IsPresale
            IsDoxxed
            Description
            AuditLink
            Website
            Telegram
            Twitter
            Discord
            LogoLink
            Status
            ContactEmail
            createdAt
            updatedAt
        }
    }
`;

export const GET_UPCOMING_PROMOTIONS = gql`
    query GetUpcomingPromotions {
        GetUpcomingPromotions {
            id
            CoinID
            StartDate
            EndDate
            ReservationNumber
            Coins {
                CoinID
                Name
                Chain
                Symbol
                ContractAddress
                LaunchDate
                IsPresale
                IsDoxxed
                Description
                AuditLink
                Website
                Telegram
                Twitter
                Discord
                LogoLink
                Status
                ContactEmail
                createdAt
                updatedAt
            }
        }
    }
`;

export const GET_CHAINS = gql`
    query GetChains {
        Chains {
            ChainID
            ChainSymbol
            Name
            Logo
            createdAt
            updatedAt
        }
    }
`;

export const GET_COUNTS = gql`
    query Count {
        ForApprovalCoinCount
        PendingReservationCount
        AllCoinCount
        DoxxedCoinCount
        PresaleCoinCount
    }
`;

export const GET_RESERVATIONS = gql`
    query GetReservations($status: String!) {
        Reservations(Status: $status) {
            Number
            AdType
            StartDate
            EndDate
            Telegram
            AmountToPay
            Discount
            PaymentStatus
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_PROMOTION = gql`
    mutation CreatePromotion($coinId: Int!, 
    $startDate: Date, $endDate: Date, 
    $reservationNumber: String, $number: String, 
    $paymentStatus: String, $txnHash: String, $memo: String) {
        createPromotion(CoinID: $coinId, StartDate: $startDate, EndDate: $endDate, ReservationNumber: $reservationNumber, Number: $number, PaymentStatus: $paymentStatus, TxnHash: $txnHash, Memo: $memo)
    }
`;

export const CREATE_BANNER_AD = gql`
    mutation CreateBannerAd($bannerType: String, $imageLocation: String, 
    $startDate: Date,   $endDate: Date, 
    $reservationNumber: String, $telegram: String, 
    $swap: String,  $website: String,
    $bannerName: String,  $number: String, 
    $description: String, $paymentStatus: String, 
    $txnHash: String, $memo: String) {
        createBannerAd(BannerType: $bannerType, ImageLocation: $imageLocation,
        StartDate: $startDate, EndDate: $endDate,
        ReservationNumber: $reservationNumber,
        Telegram: $telegram, Swap: $swap,
        Website: $website, BannerName: $bannerName, Number: $number, Description: $description, PaymentStatus: $paymentStatus, TxnHash: $txnHash, Memo: $memo)
    }
`;

export const CREATE_CHAIN = gql`
    mutation CreateChain($chainSymbol: String!, $name: String!, $logo: String) {
        createChain(ChainSymbol: $chainSymbol, Name: $name, Logo: $logo)
    }
`;

export const UPDATE_COIN_INFO = gql`
    mutation UpdateCoinInfo($name: String!, $chain: String!, $symbol: String!, $contractAddress: String!, $launchDate: Date!, $isPresale: Boolean!, $description: String!, $telegram: String!, $logoLink: String!, $coinId: Int!, 
    $isDoxxed: Boolean, $auditLink: String, $website: String, 
    $twitter: String, $discord: String, $contactEmail: String, $status: String) {
        updateCoinInfo(Name: $name, Chain: $chain, Symbol: $symbol, 
        ContractAddress: $contractAddress, LaunchDate: $launchDate, 
        IsPresale: $isPresale, Description: $description, Telegram: $telegram, 
        LogoLink: $logoLink, CoinID: $coinId, IsDoxxed: $isDoxxed, AuditLink: $auditLink,
         Website: $website, Twitter: $twitter, Discord: $discord, 
         ContactEmail: $contactEmail, Status: $status)
    }
`;

export const UPDATE_COIN_STATUS = gql`
    mutation UpdateCoinStatus($coinId: Int, $status: String) {
        updateCoinStatus(CoinID: $coinId, Status: $status)
    }
`;