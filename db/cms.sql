PGDMP                      |            sagartech-cms     15.6 (Ubuntu 15.6-1.pgdg23.10+1)     16.2 (Ubuntu 16.2-1.pgdg23.10+1)     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17789    sagartech-cms    DATABASE     u   CREATE DATABASE "sagartech-cms" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_IN';
    DROP DATABASE "sagartech-cms";
                postgres    false            �            1259    17839    stores    TABLE     �  CREATE TABLE public.stores (
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
    CONSTRAINT stores_status_check CHECK (((status >= 0) AND (status <= 2)))
);
    DROP TABLE public.stores;
       public         heap    postgres    false            �            1259    17838    stores_store_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stores_store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.stores_store_id_seq;
       public          postgres    false    219            �           0    0    stores_store_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.stores_store_id_seq OWNED BY public.stores.store_id;
          public          postgres    false    218            �            1259    17791 
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
       public         heap    postgres    false            �            1259    17790    superadmin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.superadmin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.superadmin_id_seq;
       public          postgres    false    215            �           0    0    superadmin_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.superadmin_id_seq OWNED BY public.superadmin.id;
          public          postgres    false    214            �            1259    17804    vendors_registration    TABLE     �  CREATE TABLE public.vendors_registration (
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
       public         heap    postgres    false            �            1259    17803    vendors_registration_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_registration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.vendors_registration_id_seq;
       public          postgres    false    217            �           0    0    vendors_registration_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.vendors_registration_id_seq OWNED BY public.vendors_registration.id;
          public          postgres    false    216            �           2604    17842    stores store_id    DEFAULT     r   ALTER TABLE ONLY public.stores ALTER COLUMN store_id SET DEFAULT nextval('public.stores_store_id_seq'::regclass);
 >   ALTER TABLE public.stores ALTER COLUMN store_id DROP DEFAULT;
       public          postgres    false    219    218    219            �           2604    17794    superadmin id    DEFAULT     n   ALTER TABLE ONLY public.superadmin ALTER COLUMN id SET DEFAULT nextval('public.superadmin_id_seq'::regclass);
 <   ALTER TABLE public.superadmin ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    17807    vendors_registration id    DEFAULT     �   ALTER TABLE ONLY public.vendors_registration ALTER COLUMN id SET DEFAULT nextval('public.vendors_registration_id_seq'::regclass);
 F   ALTER TABLE public.vendors_registration ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            �          0    17839    stores 
   TABLE DATA           �   COPY public.stores (store_id, store_name, address, city, state, country, vendor_id, description, phone, email, website, logo_url, banner_url, created_at, added_by_admin_id, status) FROM stdin;
    public          postgres    false    219   K*       �          0    17791 
   superadmin 
   TABLE DATA           �   COPY public.superadmin (id, first_name, last_name, email, phone_number, password, profile_image, created_at, updated_at) FROM stdin;
    public          postgres    false    215   �+       �          0    17804    vendors_registration 
   TABLE DATA           �  COPY public.vendors_registration (id, name, email, password, vendor_image, joined_date, phone_number, website_url, contact_person_name, contact_person_email, company_name, company_logo_url, business_type, industry, head_office_address_line1, head_office_address_line2, head_office_city, head_office_state, head_office_country, head_office_zipcode, is_multiple_shop, about_company, vendor_status) FROM stdin;
    public          postgres    false    217   �,       �           0    0    stores_store_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.stores_store_id_seq', 15, true);
          public          postgres    false    218            �           0    0    superadmin_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.superadmin_id_seq', 1, true);
          public          postgres    false    214            �           0    0    vendors_registration_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.vendors_registration_id_seq', 15, true);
          public          postgres    false    216            
           2606    17847    stores stores_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (store_id);
 <   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_pkey;
       public            postgres    false    219                       2606    17802    superadmin superadmin_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_email_key UNIQUE (email);
 I   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_email_key;
       public            postgres    false    215                       2606    17800    superadmin superadmin_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_pkey;
       public            postgres    false    215                       2606    17815 3   vendors_registration vendors_registration_email_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.vendors_registration
    ADD CONSTRAINT vendors_registration_email_key UNIQUE (email);
 ]   ALTER TABLE ONLY public.vendors_registration DROP CONSTRAINT vendors_registration_email_key;
       public            postgres    false    217                       2606    17813 .   vendors_registration vendors_registration_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.vendors_registration
    ADD CONSTRAINT vendors_registration_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.vendors_registration DROP CONSTRAINT vendors_registration_pkey;
       public            postgres    false    217                       2606    17853 $   stores stores_added_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_added_by_admin_id_fkey FOREIGN KEY (added_by_admin_id) REFERENCES public.superadmin(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_added_by_admin_id_fkey;
       public          postgres    false    3332    215    219                       2606    17848    stores stores_vendor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors_registration(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_vendor_id_fkey;
       public          postgres    false    3336    219    217            �   �  x��SMo�0=ï�^���x��-ڜ����B[�R-�"�����"�Ri���y���N�����q
���ۮ`��b+�m_�粯۳x:���i�/M�)�<U�����B-	�0GB*���AqNj�S���ڪ�*�(�箪Η׶ώ]�d�l���N /�n�e%Ў��
lNN��
�ɾ��w�~^A8�w�>�]�2�67`V��	�Ec�1�����s���q�ۦ��߮=�������L*�d�y:��,C:ס��gZ}28��N��u�`�誓��[V=v�I�r�
*��ʺ�ENk���6R��DҤ!"�dug�᥌��sEc�̄xxL'g΍[�~���Ǩ�z��.|���B��'+�a���dy���&��{��7 ����1,�/<�T�9�D���S9�4M�6�_+      �   �   x���;�0  й����2�1&��DC\�E(T�no<���#��U�A�U�! s>���[x� �q������'��lx��~��܃ƭ�eߤ��(�{�х�NhVn�0�2��|�\G���C�P�Qƶ��FV9�\��/�@�QUo�S>�lF�𘇱�0
�������;A��=v      �   A  x�m�1O�0�g�W���$���a���T��˕8��������$ UHt����;���ɔE#!+�>CVբ �
w��}����L�n��4\t4�z����ǬO7Q����d��)J6{�'���7��.?�+w��tB�,k��Ō���M���R�R�Q{�)�<z���<�3��8���9MN�0��s�����O��$p�2:�a��^����*ݐ�Y���(�
K�$�P
��h,��ZAQ��n��z��m�m���*�HD)e1q��	s�k�Z�r�' ��_� �Dv����t��cW��<����6�����y��3     