PGDMP                       |            sagartech-cms    16.2    16.2     ,           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            -           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            .           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            /           1262    16398    sagartech-cms    DATABASE     q   CREATE DATABASE "sagartech-cms" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE "sagartech-cms";
                postgres    false            �            1259    16399    stores    TABLE     �  CREATE TABLE public.stores (
    store_id integer NOT NULL,
    store_name character varying(255) NOT NULL,
    address character varying(255),
    city character varying(100),
    state character varying(100),
    country character varying(100),
    vendor_id integer,
    description text,
    phone character varying(20),
    email character varying(255),
    website character varying(255),
    logo_url character varying(255),
    banner_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    added_by_admin_id integer,
    status integer DEFAULT 0,
    store_slug text,
    api_key jsonb,
    CONSTRAINT stores_status_check CHECK (((status >= 0) AND (status <= 2)))
);
    DROP TABLE public.stores;
       public         heap    postgres    false            �            1259    16407    stores_store_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stores_store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.stores_store_id_seq;
       public          postgres    false    215            0           0    0    stores_store_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.stores_store_id_seq OWNED BY public.stores.store_id;
          public          postgres    false    216            �            1259    16408 
   superadmin    TABLE     �  CREATE TABLE public.superadmin (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(20),
    password character varying(255) NOT NULL,
    profile_image text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.superadmin;
       public         heap    postgres    false            �            1259    16415    superadmin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.superadmin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.superadmin_id_seq;
       public          postgres    false    217            1           0    0    superadmin_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.superadmin_id_seq OWNED BY public.superadmin.id;
          public          postgres    false    218            �            1259    16416    vendors_registration    TABLE     �  CREATE TABLE public.vendors_registration (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    vendor_image character varying(255),
    joined_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone_number character varying(20),
    website_url character varying(255),
    contact_person_name character varying(100),
    contact_person_email character varying(100),
    company_name character varying(100),
    company_logo_url character varying(255),
    business_type character varying(50),
    industry character varying(50),
    head_office_address_line1 character varying(255),
    head_office_address_line2 character varying(255),
    head_office_city character varying(100),
    head_office_state character varying(100),
    head_office_country character varying(100),
    head_office_zipcode character varying(20),
    is_multiple_shop boolean DEFAULT false,
    about_company text,
    vendor_status integer DEFAULT 1,
    CONSTRAINT vendors_registration_vendor_status_check CHECK ((vendor_status = ANY (ARRAY[1, 2, 3, 4])))
);
 (   DROP TABLE public.vendors_registration;
       public         heap    postgres    false            �            1259    16425    vendors_registration_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_registration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.vendors_registration_id_seq;
       public          postgres    false    219            2           0    0    vendors_registration_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.vendors_registration_id_seq OWNED BY public.vendors_registration.id;
          public          postgres    false    220            }           2604    16426    stores store_id    DEFAULT     r   ALTER TABLE ONLY public.stores ALTER COLUMN store_id SET DEFAULT nextval('public.stores_store_id_seq'::regclass);
 >   ALTER TABLE public.stores ALTER COLUMN store_id DROP DEFAULT;
       public          postgres    false    216    215            �           2604    16427    superadmin id    DEFAULT     n   ALTER TABLE ONLY public.superadmin ALTER COLUMN id SET DEFAULT nextval('public.superadmin_id_seq'::regclass);
 <   ALTER TABLE public.superadmin ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217            �           2604    16428    vendors_registration id    DEFAULT     �   ALTER TABLE ONLY public.vendors_registration ALTER COLUMN id SET DEFAULT nextval('public.vendors_registration_id_seq'::regclass);
 F   ALTER TABLE public.vendors_registration ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219            $          0    16399    stores 
   TABLE DATA           �   COPY public.stores (store_id, store_name, address, city, state, country, vendor_id, description, phone, email, website, logo_url, banner_url, created_at, added_by_admin_id, status, store_slug, api_key) FROM stdin;
    public          postgres    false    215   4*       &          0    16408 
   superadmin 
   TABLE DATA           �   COPY public.superadmin (id, first_name, last_name, email, phone_number, password, profile_image, created_at, updated_at) FROM stdin;
    public          postgres    false    217   +       (          0    16416    vendors_registration 
   TABLE DATA           �  COPY public.vendors_registration (id, name, email, password, vendor_image, joined_date, phone_number, website_url, contact_person_name, contact_person_email, company_name, company_logo_url, business_type, industry, head_office_address_line1, head_office_address_line2, head_office_city, head_office_state, head_office_country, head_office_zipcode, is_multiple_shop, about_company, vendor_status) FROM stdin;
    public          postgres    false    219   �+       3           0    0    stores_store_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.stores_store_id_seq', 28, true);
          public          postgres    false    216            4           0    0    superadmin_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.superadmin_id_seq', 1, true);
          public          postgres    false    218            5           0    0    vendors_registration_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.vendors_registration_id_seq', 20, true);
          public          postgres    false    220            �           2606    16430    stores stores_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (store_id);
 <   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_pkey;
       public            postgres    false    215            �           2606    16432    superadmin superadmin_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_email_key UNIQUE (email);
 I   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_email_key;
       public            postgres    false    217            �           2606    16434    superadmin superadmin_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_pkey;
       public            postgres    false    217            �           2606    16436 3   vendors_registration vendors_registration_email_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.vendors_registration
    ADD CONSTRAINT vendors_registration_email_key UNIQUE (email);
 ]   ALTER TABLE ONLY public.vendors_registration DROP CONSTRAINT vendors_registration_email_key;
       public            postgres    false    219            �           2606    16438 .   vendors_registration vendors_registration_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.vendors_registration
    ADD CONSTRAINT vendors_registration_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.vendors_registration DROP CONSTRAINT vendors_registration_pkey;
       public            postgres    false    219            �           2606    16439 $   stores stores_added_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_added_by_admin_id_fkey FOREIGN KEY (added_by_admin_id) REFERENCES public.superadmin(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_added_by_admin_id_fkey;
       public          postgres    false    215    3470    217            �           2606    16444    stores stores_vendor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors_registration(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_vendor_id_fkey;
       public          postgres    false    215    3474    219            $   �   x����
�0���S�.�Y��OA��]�T�nlR����Np�����_�Fe��9Z-_ӫ������}���&�{�
�B+cr&q1h�,�f0�����MTp��,��|�o�O��oxB��e�:����Qqi�\��ܶ|�����IDg��i��M�����\����[��eN,�h��oH�8�ڤ��F�z��,VZqL�m�      &   �   x���;�0  й����2�1&��DC\�E(T�no<���#��U�A�U�! s>���[x� �q������'��lx��~��܃ƭ�eߤ��(�{�х�NhVn�0�2��|�\G���C�P�Qƶ��FV9�\��/�@�QUo�S>�lF�𘇱�0
�������;A��=v      (   �  x�e�]o� ����Enq c�}�l�Pe��t[�J����&5�Y��G�i�:���9���)�p`/�R��i��v`N��yr=�=�k�<\-�#]m���ס��٦ξ$��q���Ӹ�Ǹ!`R}e��N�
b�1��q�rw��2;Mi{hGߚ^A班���VxU��6^A)�]=ر�����3C�t�N�64�r'Uz;@Ӷ��A7al��3��f�j@�%����F1�9�@yjJ����X,�,_�͟x�t>u�A��BN�~��K��. �w:���=�9�SD��T�gy<x��/oi}�T]�_|�/6�nQ�=��o�/���O��c|�~����_'��"aEBb����p��I�|뱓o۰�k�b�@p�WF ��$x;=�Q�k{�>     