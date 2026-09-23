--
-- PostgreSQL database dump
--

\restrict 6QqyIdeADnfqXMuepmH8fC8IgIavdWhBXGaZFLfs3wYCoXn8bo6A8sZeE5zZzUQ

-- Dumped from database version 15.19 (Debian 15.19-1.pgdg13+2)
-- Dumped by pg_dump version 15.19 (Debian 15.19-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: daily_check_ins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daily_check_ins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(3) with time zone,
    user_id uuid NOT NULL,
    checked_date date NOT NULL,
    streak integer DEFAULT 1 NOT NULL,
    gems_earned integer NOT NULL
);


ALTER TABLE public.daily_check_ins OWNER TO postgres;

--
-- Name: game_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(3) with time zone,
    user_id uuid NOT NULL,
    game_type character varying(255) DEFAULT 'memory_match'::character varying NOT NULL,
    status character varying(255) DEFAULT 'playing'::character varying NOT NULL
);


ALTER TABLE public.game_sessions OWNER TO postgres;

--
-- Name: gem_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gem_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    wallet_id uuid NOT NULL,
    user_id uuid NOT NULL,
    type character varying(255) NOT NULL,
    amount integer NOT NULL,
    balance_before integer NOT NULL,
    balance_after integer NOT NULL,
    ref_item_id uuid,
    ref_user_id uuid,
    note character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.gem_transactions OWNER TO postgres;

--
-- Name: gem_wallets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gem_wallets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(3) with time zone,
    user_id uuid NOT NULL,
    balance integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.gem_wallets OWNER TO postgres;

--
-- Name: invite_code_usages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite_code_usages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    code_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.invite_code_usages OWNER TO postgres;

--
-- Name: invite_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(3) with time zone,
    code character varying(255) NOT NULL,
    created_by uuid,
    gem_reward integer DEFAULT 500 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    max_uses integer DEFAULT '-1'::integer NOT NULL,
    used_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.invite_codes OWNER TO postgres;

--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(3) with time zone,
    name character varying(255) NOT NULL,
    description text,
    image_url character varying(255) DEFAULT NULL::character varying,
    gem_price integer NOT NULL,
    rarity character varying(255) DEFAULT 'common'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255),
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mikro_orm_migrations OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mikro_orm_migrations_id_seq OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- Name: post_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_images (
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    path character varying(255) NOT NULL,
    ext character varying(255) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    post_id uuid NOT NULL
);


ALTER TABLE public.post_images OWNER TO postgres;

--
-- Name: post_reacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_reacts (
    user_id uuid NOT NULL,
    post_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    emotion character varying(255) DEFAULT 'like'::character varying
);


ALTER TABLE public.post_reacts OWNER TO postgres;

--
-- Name: post_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_templates (
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    name character varying(255) NOT NULL,
    bg_color character varying(255) NOT NULL,
    text_color character varying(255) NOT NULL,
    font_style character varying(255)
);


ALTER TABLE public.post_templates OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    title character varying(255) DEFAULT NULL::character varying,
    content character varying(255) NOT NULL,
    react_count integer DEFAULT 0 NOT NULL,
    user_id uuid NOT NULL,
    category character varying(255) DEFAULT NULL::character varying,
    template_id uuid
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: spin_histories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spin_histories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(3) with time zone,
    user_id uuid NOT NULL,
    gems_earned integer NOT NULL,
    slot_index integer NOT NULL
);


ALTER TABLE public.spin_histories OWNER TO postgres;

--
-- Name: stored_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stored_images (
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    path character varying(255) NOT NULL,
    ext character varying(255) NOT NULL
);


ALTER TABLE public.stored_images OWNER TO postgres;

--
-- Name: user_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(3) with time zone,
    user_id uuid NOT NULL,
    item_id uuid NOT NULL,
    status character varying(255) DEFAULT 'owned'::character varying NOT NULL,
    gifted_by uuid
);


ALTER TABLE public.user_items OWNER TO postgres;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    bio character varying(255) DEFAULT NULL::character varying,
    location character varying(255) DEFAULT NULL::character varying,
    website character varying(255) DEFAULT NULL::character varying,
    date_of_birth timestamp with time zone,
    cover_avatar character varying(255) DEFAULT NULL::character varying,
    profession character varying(255) DEFAULT NULL::character varying,
    company character varying(255) DEFAULT NULL::character varying,
    education character varying(255) DEFAULT NULL::character varying,
    is_public boolean DEFAULT true NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: user_relationships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_relationships (
    user_id uuid NOT NULL,
    friend_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_relationships OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255) DEFAULT NULL::character varying,
    password character varying(255) NOT NULL,
    avatar character varying(255) DEFAULT NULL::character varying,
    role character varying(255) DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- Data for Name: daily_check_ins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.daily_check_ins (id, created_at, updated_at, deleted_at, user_id, checked_date, streak, gems_earned) FROM stdin;
eeca7763-613b-4980-a676-710410611d8d	2026-08-26 07:26:38.67+00	2026-08-26 07:26:38.67+00	\N	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	2026-08-26	1	50
db05ce1b-5e95-4e58-a8ee-b3d3f27a03bc	2026-08-26 07:45:20.031+00	2026-08-26 07:45:20.031+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	2026-08-26	1	50
\.


--
-- Data for Name: game_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_sessions (id, created_at, updated_at, deleted_at, user_id, game_type, status) FROM stdin;
2459298f-9ea1-44c7-ad31-883c7023c044	2026-08-26 08:54:17.272+00	2026-08-26 08:55:51.904+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	memory_match	completed
16eae0bb-de00-4df2-9be8-e78137358369	2026-08-26 09:03:50.958+00	2026-08-26 09:03:50.958+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	memory_match	playing
40a6966e-7eee-4443-850c-68af32afc81f	2026-08-26 09:10:22.002+00	2026-08-26 09:10:47.429+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	memory_match	completed
d67d5bcb-0f32-48b0-9735-55c8f914b13a	2026-08-26 10:05:34.39+00	2026-08-26 10:05:34.39+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	strikers_1945	playing
9287b021-2344-45b3-b61a-b69a8e1aeea5	2026-08-26 10:52:19.486+00	2026-08-26 10:52:53.814+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	memory_match	completed
7933655c-c89b-4c26-a4e2-65f6cb2bccfb	2026-08-26 10:53:04.089+00	2026-08-26 10:53:13.999+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	strikers_1945	completed
c3220a9b-f306-4dc9-b3b4-ca14748b62a7	2026-08-26 11:03:24.317+00	2026-08-26 11:03:52.438+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	strikers_1945	completed
514791c3-8c75-4db3-b1f8-6a4d651889e6	2026-08-27 02:16:09.862+00	2026-08-27 02:22:37.389+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	strikers_1945	completed
\.


--
-- Data for Name: gem_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gem_transactions (id, created_at, updated_at, wallet_id, user_id, type, amount, balance_before, balance_after, ref_item_id, ref_user_id, note) FROM stdin;
901a8347-edcc-4f26-8aa2-7a32499420de	2026-08-26 07:23:07.152+00	2026-08-26 07:23:07.152+00	16c53c95-6c2b-40b8-a8c5-a665224e23ad	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	earn_spin	150	0	150	\N	\N	Vòng quay may mắn — 150 💎
c2dcdca3-8e64-4cd7-a83c-5b7595997b88	2026-08-26 07:26:38.671+00	2026-08-26 07:26:38.671+00	16c53c95-6c2b-40b8-a8c5-a665224e23ad	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	earn_login	50	150	200	\N	\N	Điểm danh ngày 2026-08-26 — Streak 1
1e7de5fe-b81d-4e9a-a96a-72595a7aa4fa	2026-08-26 07:32:59.808+00	2026-08-26 07:32:59.808+00	16c53c95-6c2b-40b8-a8c5-a665224e23ad	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	spend_buy	100	200	100	fe3d00ab-916b-48ab-b738-fb75ba033964	\N	Mua vật phẩm: Hoa Hồng Vàng
9567a80d-8f7b-46fe-b806-028aeee37d9a	2026-08-26 07:36:30.242+00	2026-08-26 07:36:30.242+00	16c53c95-6c2b-40b8-a8c5-a665224e23ad	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	spend_buy	100	100	0	fe3d00ab-916b-48ab-b738-fb75ba033964	\N	Mua vật phẩm: Hoa Hồng Vàng
7a3ec5a0-93bb-4d10-bd6f-1295be25af0f	2026-08-26 07:45:10.474+00	2026-08-26 07:45:10.474+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	earn_spin	150	0	150	\N	\N	Vòng quay may mắn — 150 💎
a7f59d6d-46df-4f8d-b832-6a099ec88eff	2026-08-26 07:45:20.031+00	2026-08-26 07:45:20.031+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	earn_login	50	150	200	\N	\N	Điểm danh ngày 2026-08-26 — Streak 1
b99df6a7-5e3c-4a4f-b450-aebfb2351820	2026-08-26 07:57:11.053+00	2026-08-26 07:57:11.054+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_buy	500	500	0	180e2c99-9898-4a17-a19d-9d50985ba7a4	\N	Mua vật phẩm: Ngọc Lục Bảo
fb495616-424a-43da-974a-2a69261a578f	2026-08-26 07:57:33.854+00	2026-08-26 07:57:33.854+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_buy	100	100	0	fe3d00ab-916b-48ab-b738-fb75ba033964	\N	Mua vật phẩm: Hoa Hồng Vàng
098078d1-0bfb-4dd3-a5fc-76c118ffa882	2026-08-26 08:54:17.273+00	2026-08-26 08:54:17.273+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_game	10	100	90	\N	\N	Vé chơi - Memory Match
96ab8800-f439-4c9d-b941-d278efb1510f	2026-08-26 08:55:51.903+00	2026-08-26 08:55:51.903+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	earn_game	50	90	140	\N	\N	Thắng Game - Memory Match
751b4a32-9107-41ce-9280-c5840243540a	2026-08-26 09:03:50.958+00	2026-08-26 09:03:50.958+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_game	10	140	130	\N	\N	Vé chơi - Memory Match
f97032e6-2bfe-4738-8147-018bdd6b6637	2026-08-26 09:10:22.002+00	2026-08-26 09:10:22.002+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_game	10	130	120	\N	\N	Vé chơi - Memory Match
ac5e9303-3bfd-498c-8b64-d9b8c43e1a23	2026-08-26 09:10:47.429+00	2026-08-26 09:10:47.429+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	earn_game	50	120	170	\N	\N	Thắng Game - Memory Match
5770433f-274a-4ff1-a4a7-20e27480a506	2026-08-26 10:05:34.391+00	2026-08-26 10:05:34.392+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_game	10	170	160	\N	\N	Vé chơi - Strikers 1945
754a94de-0fbb-4d28-acc7-853ccfaaf6f6	2026-08-26 10:52:19.487+00	2026-08-26 10:52:19.487+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_game	10	160	150	\N	\N	Vé chơi - Memory Match
3a3e76f9-1bbe-4629-ae82-c8ca17c1e0f3	2026-08-26 10:52:53.814+00	2026-08-26 10:52:53.814+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	earn_game	50	150	200	\N	\N	Thắng Game - Memory Match
b7e26ce4-1504-43cf-a7ae-8601f4dd3814	2026-08-26 10:53:04.089+00	2026-08-26 10:53:04.089+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_game	10	200	190	\N	\N	Vé chơi - Strikers 1945
ff31e64a-5fec-49d2-93eb-99fc4ebfe476	2026-08-26 11:03:24.318+00	2026-08-26 11:03:24.318+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_game	10	190	180	\N	\N	Vé chơi - Strikers 1945
af6149f9-c1a6-41d6-b1cc-24842fd2cf1f	2026-08-26 11:03:52.438+00	2026-08-26 11:03:52.438+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	earn_game	10	180	190	\N	\N	Thưởng Strikers 1945 (23 điểm)
c5caa2e7-e57e-4c52-88b0-8aa1735261b9	2026-08-27 02:16:09.863+00	2026-08-27 02:16:09.863+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	spend_game	10	190	180	\N	\N	Vé chơi - Strikers 1945
41c2234c-912e-40ad-adfb-21cd798179df	2026-08-27 02:22:37.389+00	2026-08-27 02:22:37.389+00	3d0ed2b7-08df-43e8-b296-145b2c3b63e9	869d4b0a-4c27-4c1e-b503-b6e8d538f329	earn_game	10	180	190	\N	\N	Thưởng Strikers 1945 (22 điểm)
\.


--
-- Data for Name: gem_wallets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gem_wallets (id, created_at, updated_at, deleted_at, user_id, balance) FROM stdin;
16c53c95-6c2b-40b8-a8c5-a665224e23ad	2026-08-26 07:23:07.143+00	2026-08-26 07:36:30.243+00	\N	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	0
3d0ed2b7-08df-43e8-b296-145b2c3b63e9	2026-08-26 07:40:17.403+00	2026-08-27 02:22:37.389+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	190
\.


--
-- Data for Name: invite_code_usages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite_code_usages (id, created_at, updated_at, code_id, user_id) FROM stdin;
\.


--
-- Data for Name: invite_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite_codes (id, created_at, updated_at, deleted_at, code, created_by, gem_reward, is_active, max_uses, used_count) FROM stdin;
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, created_at, updated_at, deleted_at, name, description, image_url, gem_price, rarity, is_active) FROM stdin;
fe3d00ab-916b-48ab-b738-fb75ba033964	2026-08-24 11:06:21.528+00	2026-08-24 11:06:21.528+00	\N	Hoa Hồng Vàng	Đóa hoa hồng vàng lấp lánh, biểu tượng của sự trân trọng và tình cảm.	/items/golden_rose.png	100	common	t
180e2c99-9898-4a17-a19d-9d50985ba7a4	2026-08-24 11:06:21.56+00	2026-08-24 11:06:21.561+00	\N	Ngọc Lục Bảo	Viên ngọc lục bảo huyền bí, chứa đựng năng lượng của đại dương sâu thẳm.	/items/emerald_gem.png	500	rare	t
63ff7377-c3ae-4095-a489-40deddc47dbc	2026-08-24 11:06:21.569+00	2026-08-24 11:06:21.569+00	\N	Vương Miện Pha Lê	Chiếc vương miện pha lê lộng lẫy, chỉ dành cho những người đặc biệt nhất.	/items/crystal_crown.png	2000	epic	t
c27acf03-816b-4176-a1c6-363b59a5f263	2026-08-24 11:06:21.575+00	2026-08-24 11:06:21.575+00	\N	Rồng Huyền Thoại	Con rồng vàng huyền thoại, biểu tượng của sức mạnh và uy quyền tối thượng.	/items/legendary_dragon.png	9999	legendary	t
\.


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260531000000_initial_schema	2026-07-28 08:34:43.507078+00
2	Migration20260728095903_add_post_images_and_templates	2026-07-28 10:00:03.797778+00
3	Migration20260824000000_gem_wallet_and_items	2026-08-24 10:41:21.790323+00
4	Migration20260826000000_daily_checkin_and_spin	2026-08-26 07:19:56.303567+00
5	Migration20260826154800_gamesession	2026-08-26 08:53:34.502357+00
\.


--
-- Data for Name: post_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_images (id, created_at, updated_at, deleted_at, path, ext, sort_order, post_id) FROM stdin;
36ae11ea-e060-4453-9505-4f961505c292	2026-07-28 10:19:54.28+00	2026-07-28 10:19:54.28+00	\N	posts/f193f92f-d7e9-4630-a79e-2d77efc65bae.jpeg	jpeg	2	ed38b402-e12f-43a5-9ebb-0991760849ab
71291a17-a5d8-445b-9976-94853ed92441	2026-07-28 10:19:54.283+00	2026-07-28 10:19:54.283+00	\N	posts/12792ddd-1fc8-4c65-8df5-0d1056cca318.jpeg	jpeg	3	ed38b402-e12f-43a5-9ebb-0991760849ab
d83c9a82-d974-4ef0-aa77-14d8c7372ad4	2026-07-28 10:19:54.284+00	2026-07-28 10:19:54.284+00	\N	posts/a537f0b2-f1d7-4545-886d-8642d314cbea.png	png	5	ed38b402-e12f-43a5-9ebb-0991760849ab
70151f5f-0937-4d92-ab14-a5e4cf3b6a27	2026-07-28 10:19:54.286+00	2026-07-28 10:19:54.286+00	\N	posts/6ff856eb-0dc3-421a-9400-a10938e61e16.jpeg	jpeg	4	ed38b402-e12f-43a5-9ebb-0991760849ab
962b5c6f-8436-4283-a2d0-6ff2fb100c55	2026-07-28 10:19:54.288+00	2026-07-28 10:19:54.288+00	\N	posts/91b2669e-9755-4523-9633-f046e2a38a9d.jpeg	jpeg	0	ed38b402-e12f-43a5-9ebb-0991760849ab
c83ad23e-7584-4e9d-a873-d51a615a323e	2026-07-28 10:19:54.289+00	2026-07-28 10:19:54.289+00	\N	posts/ccc5ca36-1dc8-4188-854f-cbff087a21e8.png	png	6	ed38b402-e12f-43a5-9ebb-0991760849ab
fff2fa4f-57d5-4236-b88a-b2d424ff239c	2026-07-28 10:19:54.291+00	2026-07-28 10:19:54.291+00	\N	posts/3fb1f4b5-a65e-44f1-a46d-7230456b016c.jpeg	jpeg	1	ed38b402-e12f-43a5-9ebb-0991760849ab
959652e8-c5d4-4470-b260-46d98054174e	2026-07-28 10:30:05.316+00	2026-07-28 10:30:05.316+00	\N	posts/29590d37-d711-44ab-9f13-9880f75f333c.png	png	3	86dbbbdb-ddfa-4e03-9788-1671201490df
e217a41b-f98f-40a0-b4ca-1bdfcb18aa3f	2026-07-28 10:30:05.317+00	2026-07-28 10:30:05.317+00	\N	posts/e8e7a477-756f-4e4f-8ccf-be28fe334b54.jpeg	jpeg	0	86dbbbdb-ddfa-4e03-9788-1671201490df
58594923-4b6e-4bfe-b38f-019020da15c2	2026-07-28 10:30:05.318+00	2026-07-28 10:30:05.318+00	\N	posts/4e71836d-1b0c-467f-9e6f-7cbdad2461ce.png	png	6	86dbbbdb-ddfa-4e03-9788-1671201490df
63c1d2b2-dd5f-4616-bf15-e300f1cdbe84	2026-07-28 10:30:05.319+00	2026-07-28 10:30:05.319+00	\N	posts/b4cec190-3b9a-4023-986e-e659ab031a75.png	png	4	86dbbbdb-ddfa-4e03-9788-1671201490df
830394a7-61c2-4efd-b3a5-01a8d18820d2	2026-07-28 10:30:05.319+00	2026-07-28 10:30:05.319+00	\N	posts/124b2d1a-6d06-49d5-8861-006926e6888c.png	png	5	86dbbbdb-ddfa-4e03-9788-1671201490df
debf2c77-588f-4c77-861a-406b8eb1fbb6	2026-07-28 10:30:05.32+00	2026-07-28 10:30:05.32+00	\N	posts/f488546f-03a2-47e4-b812-d7dc7919fa49.png	png	8	86dbbbdb-ddfa-4e03-9788-1671201490df
3afcef71-de98-4a31-9cb8-746df4069ecb	2026-07-28 10:30:05.321+00	2026-07-28 10:30:05.321+00	\N	posts/d146082e-1b95-4a2c-9652-504b0d102c73.png	png	2	86dbbbdb-ddfa-4e03-9788-1671201490df
0e63eac4-33e6-49e0-8ad8-364f2767758d	2026-07-28 10:30:05.322+00	2026-07-28 10:30:05.322+00	\N	posts/5e74184b-8a38-4118-b643-bd2a048ba596.jpeg	jpeg	1	86dbbbdb-ddfa-4e03-9788-1671201490df
28735e4e-2cbb-4701-8091-f559bfb78414	2026-07-28 10:30:05.329+00	2026-07-28 10:30:05.329+00	\N	posts/5e36e8c8-433c-41a5-8d1b-52a5deb6b46c.jpg	jpg	7	86dbbbdb-ddfa-4e03-9788-1671201490df
3869dc0b-2e99-41f4-9641-a13902ebab7a	2026-07-29 10:06:37.226+00	2026-07-29 10:06:37.227+00	\N	posts/2c29c413-b9e4-4287-b4a6-63655456f40e.jpeg	jpeg	0	3ed38127-0d08-4de1-8c58-167b2bf48afd
245afd9d-1180-459f-a718-a139818a7f13	2026-07-29 10:06:37.228+00	2026-07-29 10:06:37.228+00	\N	posts/a76497b6-bb6c-4928-89fc-447e209bd959.jpeg	jpeg	2	3ed38127-0d08-4de1-8c58-167b2bf48afd
1aa05131-f3ba-459a-b622-602f07601a58	2026-07-29 10:06:37.23+00	2026-07-29 10:06:37.23+00	\N	posts/aca46630-6ff2-47dc-9d89-d37aca0790dd.jpeg	jpeg	1	3ed38127-0d08-4de1-8c58-167b2bf48afd
\.


--
-- Data for Name: post_reacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_reacts (user_id, post_id, created_at, updated_at, emotion) FROM stdin;
65c1138e-4596-4fe1-9e6c-66bf8f76fbec	4cf3904c-e2a2-4e5c-a26c-d81630f442e9	2026-07-29 10:01:40.487+00	2026-07-29 10:01:40.487+00	like
\.


--
-- Data for Name: post_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_templates (id, created_at, updated_at, deleted_at, name, bg_color, text_color, font_style) FROM stdin;
45eb148b-459d-4cde-abc0-d3c07b8d743a	2026-07-28 10:00:53.923+00	2026-07-28 10:00:53.924+00	\N	Sunshine	linear-gradient(135deg, #f5af19, #f12711)	#ffffff	\N
13b21137-e423-4109-89b8-32eba70b0ee2	2026-07-28 10:00:54.323+00	2026-07-28 10:00:54.323+00	\N	Ocean	linear-gradient(135deg, #1cb5e0, #000046)	#ffffff	\N
1c33dcd6-51b8-4cc7-82df-b1d50bdea670	2026-07-28 10:00:54.343+00	2026-07-28 10:00:54.343+00	\N	Forest	linear-gradient(135deg, #134e5e, #71b280)	#ffffff	\N
062f9e11-0fd7-4c4a-87eb-01410618b2f4	2026-07-28 10:00:54.366+00	2026-07-28 10:00:54.366+00	\N	Midnight	linear-gradient(135deg, #232526, #414345)	#f0f0f0	italic
b9d1a289-c21f-42dd-af38-cb4a1b800b4d	2026-07-28 10:00:54.386+00	2026-07-28 10:00:54.386+00	\N	Lavender	linear-gradient(135deg, #c471ed, #12c2e9)	#ffffff	\N
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, created_at, updated_at, deleted_at, title, content, react_count, user_id, category, template_id) FROM stdin;
b1b1a0ea-3d03-4e6f-b1a9-539764257a84	2026-07-28 09:11:07.976+00	2026-07-28 09:11:07.976+00	\N	\N	post đầu tiên	0	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	\N	\N
7e0d15cd-7bf6-439a-9909-eaa2db84caae	2026-07-28 09:22:20.888+00	2026-07-28 09:22:20.888+00	\N	\N	kame joko	0	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	\N	\N
ed38b402-e12f-43a5-9ebb-0991760849ab	2026-07-28 10:19:54.173+00	2026-07-28 10:19:54.173+00	\N	\N	Đậu xanh m !!!	0	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	\N	\N
4cf3904c-e2a2-4e5c-a26c-d81630f442e9	2026-07-29 10:01:36.923+00	2026-07-29 10:01:40.488+00	\N	\N	Hôm Nay làm gì?\r\n	1	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	\N	1c33dcd6-51b8-4cc7-82df-b1d50bdea670
3ed38127-0d08-4de1-8c58-167b2bf48afd	2026-07-29 10:06:37.18+00	2026-07-29 10:06:37.18+00	\N	\N	alo aloalo	0	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	\N	\N
86dbbbdb-ddfa-4e03-9788-1671201490df	2026-07-28 10:30:05.261+00	2026-07-29 11:04:34.528+00	\N	\N	alo alo	0	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	\N	\N
\.


--
-- Data for Name: spin_histories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spin_histories (id, created_at, updated_at, deleted_at, user_id, gems_earned, slot_index) FROM stdin;
d026dd23-1c21-4078-90ed-367afd9f8794	2026-08-26 07:23:07.151+00	2026-08-26 07:23:07.151+00	\N	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	150	3
05ddf198-5fc5-4f66-aff0-c1513344ed6d	2026-08-26 07:45:10.474+00	2026-08-26 07:45:10.474+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	150	3
\.


--
-- Data for Name: stored_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stored_images (id, created_at, updated_at, deleted_at, path, ext) FROM stdin;
12b96d0f-461a-4f96-bb6a-f46927857ed0	2026-07-28 09:11:07.96+00	2026-07-28 09:11:07.96+00	\N	posts/e051fe60-ab8e-4b0d-a50f-9a462afa8392.png	png
c324550f-54b8-46d6-b44b-fdbd804ba7a0	2026-07-28 09:22:20.886+00	2026-07-28 09:22:20.886+00	\N	posts/afec8dee-fc15-4542-ab31-5a1ff751f33e.jpeg	jpeg
\.


--
-- Data for Name: user_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_items (id, created_at, updated_at, deleted_at, user_id, item_id, status, gifted_by) FROM stdin;
f9a29dba-d9f4-48cf-b948-6a98a0b57c50	2026-08-26 07:32:59.808+00	2026-08-26 07:32:59.808+00	\N	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	fe3d00ab-916b-48ab-b738-fb75ba033964	owned	\N
0f2b38f5-a91a-47da-8638-35723d5b8eaf	2026-08-26 07:36:30.242+00	2026-08-26 07:36:30.242+00	\N	65c1138e-4596-4fe1-9e6c-66bf8f76fbec	fe3d00ab-916b-48ab-b738-fb75ba033964	owned	\N
d17b490e-f3a3-47d2-a66a-e827937500c5	2026-08-26 07:57:11.054+00	2026-08-26 07:57:11.054+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	180e2c99-9898-4a17-a19d-9d50985ba7a4	owned	\N
3d718364-1729-443e-b1a0-c36e7b77e79d	2026-08-26 07:57:33.854+00	2026-08-26 07:57:33.854+00	\N	869d4b0a-4c27-4c1e-b503-b6e8d538f329	fe3d00ab-916b-48ab-b738-fb75ba033964	owned	\N
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (id, created_at, updated_at, deleted_at, bio, location, website, date_of_birth, cover_avatar, profession, company, education, is_public, user_id) FROM stdin;
b2b813ad-5316-4b3a-b6fe-0450ceb0cf51	2026-07-28 08:34:55.754+00	2026-07-28 08:34:55.754+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	65c1138e-4596-4fe1-9e6c-66bf8f76fbec
c3760b5e-7c7f-4d95-aa0d-51b513f6d068	2026-07-29 10:08:42.879+00	2026-07-29 10:08:42.879+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	dc89cc90-7d1f-4ebb-8e50-6598da714e2d
ebf0905d-dc30-4482-aa9a-081d533b51a5	2026-07-29 10:14:30.431+00	2026-07-29 10:14:30.431+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	869d4b0a-4c27-4c1e-b503-b6e8d538f329
\.


--
-- Data for Name: user_relationships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_relationships (user_id, friend_id, created_at, updated_at, status, deleted_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, updated_at, deleted_at, user_name, email, phone, password, avatar, role) FROM stdin;
65c1138e-4596-4fe1-9e6c-66bf8f76fbec	2026-07-28 08:34:55.733+00	2026-07-28 08:34:55.733+00	\N	Lượng Lê Đức	luong.ld@zinza.com.vn	\N	$2b$10$QTwNnAZVlvweNZJOh.Z7EuDtBSySyxnwo.DIfYYf7Rusp/L1LPrbC	https://lh3.googleusercontent.com/a/ACg8ocLTxqXCktWJYytCEti907S4bZT4obg4Xm2Hn2LJVGOacAge4w=s96-c	user
2d40f0ef-1ac8-4666-8a30-fd1cafbbb65f	2026-07-28 08:36:05.407+00	2026-07-28 08:36:05.407+00	\N	Jewel42	Rupert.Kunde99@yahoo.com	1-742-454-0990	4Bby3nimMi2J9SF	https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/86.jpg	user
f9987a29-2ead-4d7d-8819-ac9ca15d57d9	2026-07-28 08:36:05.411+00	2026-07-28 08:36:05.411+00	\N	Marjory69	Reggie.Ritchie@gmail.com	411.961.6298 x99841	j4wNlFiOE8_9M4k	https://avatars.githubusercontent.com/u/15860915	user
b6d4ac2a-1859-4723-a5d1-f3243b64a9f5	2026-07-28 08:36:05.411+00	2026-07-28 08:36:05.411+00	\N	German11	Caterina.Sporer@yahoo.com	1-608-224-5567 x204	3KY6o2ZH0xV0UwO	https://avatars.githubusercontent.com/u/41208449	user
52ba8b54-344d-408b-b35f-716625a66a77	2026-07-28 08:36:05.412+00	2026-07-28 08:36:05.412+00	\N	Desiree_Wisoky86	Amelie30@gmail.com	(403) 993-4740 x0167	buhFBsOpeB94zAz	https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/84.jpg	user
098309e3-9c8b-41bd-a818-d2dda0513ed5	2026-07-28 08:36:05.412+00	2026-07-28 08:36:05.412+00	\N	Frankie.Ebert-Blick47	Abe32@hotmail.com	782.333.8410 x511	_UDEpPjNfZL4Pw9	https://avatars.githubusercontent.com/u/71561101	user
df838aca-e2ae-45d0-a9e1-956db08ec17b	2026-07-28 08:36:05.412+00	2026-07-28 08:36:05.412+00	\N	Teresa.Hessel92	Nathen_Hamill6@hotmail.com	1-705-240-8268 x76629	1P2NnxMSa7F6sud	https://avatars.githubusercontent.com/u/3098616	user
607ead1c-c8b1-4fb1-ba23-a1e276435ccd	2026-07-28 08:36:05.412+00	2026-07-28 08:36:05.412+00	\N	Anne28	Orin.Grant@gmail.com	261-990-9212 x28627	zMGgW6cELYjr6_4	https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/14.jpg	user
4d203e9f-7425-456a-a5af-7625c7083407	2026-07-28 08:36:05.413+00	2026-07-28 08:36:05.413+00	\N	Marietta_Walker	Jamaal98@gmail.com	(240) 573-8220 x48430	NxOPHSCJcfE7Exp	https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/99.jpg	user
d371df3a-7f85-4597-bb58-6cdcf45a679e	2026-07-28 08:36:05.413+00	2026-07-28 08:36:05.413+00	\N	Adonis98	Waino55@yahoo.com	(517) 985-2324 x3896	1OooBPuK658uIYF	https://avatars.githubusercontent.com/u/90255409	user
59d9a8b8-b02f-4e17-af32-d12f78e4dc14	2026-07-28 08:36:05.413+00	2026-07-28 08:36:05.413+00	\N	Gabriel_Schroeder89	Marianna.Homenick@hotmail.com	569.585.4141 x5801	1yZBiJ4s4JzP8lO	https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/3.jpg	user
dc89cc90-7d1f-4ebb-8e50-6598da714e2d	2026-07-29 10:08:42.874+00	2026-07-29 10:08:42.874+00	\N	yughio le	trumyugioh@gmail.com	\N	$2b$10$m2KoQgF6Fuxn7LfRFzdaquRZp4Z8f5fECtInczrQXLcP9wk8RFtUm	https://lh3.googleusercontent.com/a/ACg8ocLkX13LO-6lkmZ8Evr1Re50mjbeEBJQpksKQELP_HJT8lyQxLc=s96-c	user
869d4b0a-4c27-4c1e-b503-b6e8d538f329	2026-07-29 10:14:30.427+00	2026-07-29 10:14:30.427+00	\N	huy le duc	lehuyaz981@gmail.com	\N	$2b$10$52GG.//UjJtwJaC4zqSO1uo4OogFHMnNGrTJo/h5kLKxfZGxVfcH6	https://lh3.googleusercontent.com/a/ACg8ocKOM9ElDeAd1E8jMkGx5-pMj44thFr7_lzUPqDU2OJh-PxlEg=s96-c	user
\.


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 5, true);


--
-- Name: daily_check_ins daily_check_ins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_check_ins
    ADD CONSTRAINT daily_check_ins_pkey PRIMARY KEY (id);


--
-- Name: daily_check_ins daily_check_ins_user_id_checked_date_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_check_ins
    ADD CONSTRAINT daily_check_ins_user_id_checked_date_unique UNIQUE (user_id, checked_date);


--
-- Name: game_sessions game_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_sessions
    ADD CONSTRAINT game_sessions_pkey PRIMARY KEY (id);


--
-- Name: gem_transactions gem_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gem_transactions
    ADD CONSTRAINT gem_transactions_pkey PRIMARY KEY (id);


--
-- Name: gem_wallets gem_wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gem_wallets
    ADD CONSTRAINT gem_wallets_pkey PRIMARY KEY (id);


--
-- Name: gem_wallets gem_wallets_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gem_wallets
    ADD CONSTRAINT gem_wallets_user_id_unique UNIQUE (user_id);


--
-- Name: invite_code_usages invite_code_usages_code_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_code_usages
    ADD CONSTRAINT invite_code_usages_code_id_user_id_unique UNIQUE (code_id, user_id);


--
-- Name: invite_code_usages invite_code_usages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_code_usages
    ADD CONSTRAINT invite_code_usages_pkey PRIMARY KEY (id);


--
-- Name: invite_codes invite_codes_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_code_unique UNIQUE (code);


--
-- Name: invite_codes invite_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- Name: post_images post_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_images
    ADD CONSTRAINT post_images_pkey PRIMARY KEY (id);


--
-- Name: post_reacts post_reacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_reacts
    ADD CONSTRAINT post_reacts_pkey PRIMARY KEY (user_id, post_id);


--
-- Name: post_templates post_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_templates
    ADD CONSTRAINT post_templates_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: spin_histories spin_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spin_histories
    ADD CONSTRAINT spin_histories_pkey PRIMARY KEY (id);


--
-- Name: stored_images stored_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stored_images
    ADD CONSTRAINT stored_images_pkey PRIMARY KEY (id);


--
-- Name: user_items user_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_items
    ADD CONSTRAINT user_items_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id);


--
-- Name: user_relationships user_relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_relationships
    ADD CONSTRAINT user_relationships_pkey PRIMARY KEY (user_id, friend_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: daily_check_ins daily_check_ins_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_check_ins
    ADD CONSTRAINT daily_check_ins_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_sessions game_sessions_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_sessions
    ADD CONSTRAINT game_sessions_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gem_transactions gem_transactions_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gem_transactions
    ADD CONSTRAINT gem_transactions_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gem_transactions gem_transactions_wallet_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gem_transactions
    ADD CONSTRAINT gem_transactions_wallet_id_foreign FOREIGN KEY (wallet_id) REFERENCES public.gem_wallets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gem_wallets gem_wallets_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gem_wallets
    ADD CONSTRAINT gem_wallets_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invite_code_usages invite_code_usages_code_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_code_usages
    ADD CONSTRAINT invite_code_usages_code_id_foreign FOREIGN KEY (code_id) REFERENCES public.invite_codes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invite_code_usages invite_code_usages_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_code_usages
    ADD CONSTRAINT invite_code_usages_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invite_codes invite_codes_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_created_by_foreign FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: post_images post_images_post_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_images
    ADD CONSTRAINT post_images_post_id_foreign FOREIGN KEY (post_id) REFERENCES public.posts(id) ON UPDATE CASCADE;


--
-- Name: post_reacts post_reacts_post_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_reacts
    ADD CONSTRAINT post_reacts_post_id_foreign FOREIGN KEY (post_id) REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: post_reacts post_reacts_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_reacts
    ADD CONSTRAINT post_reacts_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: posts posts_template_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_template_id_foreign FOREIGN KEY (template_id) REFERENCES public.post_templates(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: posts posts_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: spin_histories spin_histories_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spin_histories
    ADD CONSTRAINT spin_histories_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_items user_items_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_items
    ADD CONSTRAINT user_items_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_items user_items_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_items
    ADD CONSTRAINT user_items_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_relationships user_relationships_friend_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_relationships
    ADD CONSTRAINT user_relationships_friend_id_foreign FOREIGN KEY (friend_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_relationships user_relationships_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_relationships
    ADD CONSTRAINT user_relationships_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 6QqyIdeADnfqXMuepmH8fC8IgIavdWhBXGaZFLfs3wYCoXn8bo6A8sZeE5zZzUQ

