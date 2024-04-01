PGDMP  ,                    |            sagartech-cms    16.2    16.2 G    m           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            n           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            o           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            p           1262    17090    sagartech-cms    DATABASE     q   CREATE DATABASE "sagartech-cms" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE "sagartech-cms";
                postgres    false            �            1259    17190 
   attributes    TABLE     �   CREATE TABLE public.attributes (
    attribute_id integer NOT NULL,
    attribute_name character varying(255) NOT NULL,
    attribute_values text[],
    category text,
    subcategory text,
    store_name text,
    vendor_id integer
);
    DROP TABLE public.attributes;
       public         heap    postgres    false            �            1259    17188    attributes_attribute_id_seq    SEQUENCE     �   CREATE SEQUENCE public.attributes_attribute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.attributes_attribute_id_seq;
       public          postgres    false            �            1259    17189    attributes_attribute_id_seq1    SEQUENCE     �   CREATE SEQUENCE public.attributes_attribute_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.attributes_attribute_id_seq1;
       public          postgres    false    229            q           0    0    attributes_attribute_id_seq1    SEQUENCE OWNED BY     \   ALTER SEQUENCE public.attributes_attribute_id_seq1 OWNED BY public.attributes.attribute_id;
          public          postgres    false    228            �            1259    17200 
   categories    TABLE     �  CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    category_description text,
    category_image_url character varying(255),
    category_status boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category_type character varying(255),
    attribute_cat_id integer[],
    vendor_id integer,
    store_name text
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    17152    categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_category_id_seq;
       public          postgres    false            �            1259    17199    categories_category_id_seq1    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.categories_category_id_seq1;
       public          postgres    false    231            r           0    0    categories_category_id_seq1    SEQUENCE OWNED BY     Z   ALTER SEQUENCE public.categories_category_id_seq1 OWNED BY public.categories.category_id;
          public          postgres    false    230            �            1259    17142 	   customers    TABLE     �  CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(20),
    address_country character varying(100),
    address_company character varying(255),
    address_line1 text,
    address_line2 text,
    city character varying(100),
    state character varying(100),
    pin_code character varying(20),
    phone_number_address character varying(20),
    note text,
    collect_taxes boolean,
    customer_media text,
    vendor_id integer,
    store_name character varying(255),
    countryjsonb jsonb
);
    DROP TABLE public.customers;
       public         heap    postgres    false            �            1259    17141    customers_customer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.customers_customer_id_seq;
       public          postgres    false    222            s           0    0    customers_customer_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;
          public          postgres    false    221            �            1259    17212    products    TABLE     �  CREATE TABLE public.products (
    product_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category text,
    subcategory text,
    slug_cat character varying(255),
    slug_subcat character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    17211    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    233            t           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    232            �            1259    17091    stores    TABLE     �  CREATE TABLE public.stores (
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
       public         heap    postgres    false            �            1259    17099    stores_store_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stores_store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.stores_store_id_seq;
       public          postgres    false    215            u           0    0    stores_store_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.stores_store_id_seq OWNED BY public.stores.store_id;
          public          postgres    false    216            �            1259    17167    subcategories    TABLE     �  CREATE TABLE public.subcategories (
    subcategory_id integer NOT NULL,
    subcategory_name character varying(255) NOT NULL,
    subcategory_description text,
    subcategory_image_url character varying(255),
    parent_category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    isfeatured boolean,
    subcat_status boolean,
    nested_subcategories jsonb
);
 !   DROP TABLE public.subcategories;
       public         heap    postgres    false            �            1259    17165     subcategories_subcategory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.subcategories_subcategory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.subcategories_subcategory_id_seq;
       public          postgres    false            �            1259    17166 !   subcategories_subcategory_id_seq1    SEQUENCE     �   CREATE SEQUENCE public.subcategories_subcategory_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.subcategories_subcategory_id_seq1;
       public          postgres    false    226            v           0    0 !   subcategories_subcategory_id_seq1    SEQUENCE OWNED BY     f   ALTER SEQUENCE public.subcategories_subcategory_id_seq1 OWNED BY public.subcategories.subcategory_id;
          public          postgres    false    225            �            1259    17100 
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
       public         heap    postgres    false            �            1259    17107    superadmin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.superadmin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.superadmin_id_seq;
       public          postgres    false    217            w           0    0    superadmin_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.superadmin_id_seq OWNED BY public.superadmin.id;
          public          postgres    false    218            �            1259    17108    vendors_registration    TABLE     �  CREATE TABLE public.vendors_registration (
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
       public         heap    postgres    false            �            1259    17117    vendors_registration_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_registration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.vendors_registration_id_seq;
       public          postgres    false    219            x           0    0    vendors_registration_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.vendors_registration_id_seq OWNED BY public.vendors_registration.id;
          public          postgres    false    220            �           2604    17193    attributes attribute_id    DEFAULT     �   ALTER TABLE ONLY public.attributes ALTER COLUMN attribute_id SET DEFAULT nextval('public.attributes_attribute_id_seq1'::regclass);
 F   ALTER TABLE public.attributes ALTER COLUMN attribute_id DROP DEFAULT;
       public          postgres    false    229    228    229            �           2604    17203    categories category_id    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq1'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    231    230    231            �           2604    17145    customers customer_id    DEFAULT     ~   ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);
 D   ALTER TABLE public.customers ALTER COLUMN customer_id DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    17215    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    233    232    233            �           2604    17118    stores store_id    DEFAULT     r   ALTER TABLE ONLY public.stores ALTER COLUMN store_id SET DEFAULT nextval('public.stores_store_id_seq'::regclass);
 >   ALTER TABLE public.stores ALTER COLUMN store_id DROP DEFAULT;
       public          postgres    false    216    215            �           2604    17170    subcategories subcategory_id    DEFAULT     �   ALTER TABLE ONLY public.subcategories ALTER COLUMN subcategory_id SET DEFAULT nextval('public.subcategories_subcategory_id_seq1'::regclass);
 K   ALTER TABLE public.subcategories ALTER COLUMN subcategory_id DROP DEFAULT;
       public          postgres    false    226    225    226            �           2604    17119    superadmin id    DEFAULT     n   ALTER TABLE ONLY public.superadmin ALTER COLUMN id SET DEFAULT nextval('public.superadmin_id_seq'::regclass);
 <   ALTER TABLE public.superadmin ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217            �           2604    17120    vendors_registration id    DEFAULT     �   ALTER TABLE ONLY public.vendors_registration ALTER COLUMN id SET DEFAULT nextval('public.vendors_registration_id_seq'::regclass);
 F   ALTER TABLE public.vendors_registration ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219            f          0    17190 
   attributes 
   TABLE DATA           �   COPY public.attributes (attribute_id, attribute_name, attribute_values, category, subcategory, store_name, vendor_id) FROM stdin;
    public          postgres    false    229   c       h          0    17200 
   categories 
   TABLE DATA           �   COPY public.categories (category_id, category_name, category_description, category_image_url, category_status, created_at, updated_at, category_type, attribute_cat_id, vendor_id, store_name) FROM stdin;
    public          postgres    false    231   oc       _          0    17142 	   customers 
   TABLE DATA             COPY public.customers (customer_id, first_name, last_name, email, password, phone, address_country, address_company, address_line1, address_line2, city, state, pin_code, phone_number_address, note, collect_taxes, customer_media, vendor_id, store_name, countryjsonb) FROM stdin;
    public          postgres    false    222   Id       j          0    17212    products 
   TABLE DATA           �   COPY public.products (product_id, title, description, category, subcategory, slug_cat, slug_subcat, created_at, updated_at) FROM stdin;
    public          postgres    false    233   �e       X          0    17091    stores 
   TABLE DATA           �   COPY public.stores (store_id, store_name, address, city, state, country, vendor_id, description, phone, email, website, logo_url, banner_url, created_at, added_by_admin_id, status, store_slug, api_key) FROM stdin;
    public          postgres    false    215   �e       c          0    17167    subcategories 
   TABLE DATA           �   COPY public.subcategories (subcategory_id, subcategory_name, subcategory_description, subcategory_image_url, parent_category_id, created_at, updated_at, isfeatured, subcat_status, nested_subcategories) FROM stdin;
    public          postgres    false    226   �f       Z          0    17100 
   superadmin 
   TABLE DATA           �   COPY public.superadmin (id, first_name, last_name, email, phone_number, password, profile_image, created_at, updated_at) FROM stdin;
    public          postgres    false    217   �g       \          0    17108    vendors_registration 
   TABLE DATA           �  COPY public.vendors_registration (id, name, email, password, vendor_image, joined_date, phone_number, website_url, contact_person_name, contact_person_email, company_name, company_logo_url, business_type, industry, head_office_address_line1, head_office_address_line2, head_office_city, head_office_state, head_office_country, head_office_zipcode, is_multiple_shop, about_company, vendor_status) FROM stdin;
    public          postgres    false    219   `h       y           0    0    attributes_attribute_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.attributes_attribute_id_seq', 1, false);
          public          postgres    false    227            z           0    0    attributes_attribute_id_seq1    SEQUENCE SET     J   SELECT pg_catalog.setval('public.attributes_attribute_id_seq1', 2, true);
          public          postgres    false    228            {           0    0    categories_category_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.categories_category_id_seq', 1, false);
          public          postgres    false    223            |           0    0    categories_category_id_seq1    SEQUENCE SET     I   SELECT pg_catalog.setval('public.categories_category_id_seq1', 3, true);
          public          postgres    false    230            }           0    0    customers_customer_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.customers_customer_id_seq', 1, true);
          public          postgres    false    221            ~           0    0    products_product_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_product_id_seq', 1, false);
          public          postgres    false    232                       0    0    stores_store_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.stores_store_id_seq', 28, true);
          public          postgres    false    216            �           0    0     subcategories_subcategory_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.subcategories_subcategory_id_seq', 1, false);
          public          postgres    false    224            �           0    0 !   subcategories_subcategory_id_seq1    SEQUENCE SET     O   SELECT pg_catalog.setval('public.subcategories_subcategory_id_seq1', 1, true);
          public          postgres    false    225            �           0    0    superadmin_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.superadmin_id_seq', 1, true);
          public          postgres    false    218            �           0    0    vendors_registration_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.vendors_registration_id_seq', 20, true);
          public          postgres    false    220            �           2606    17197    attributes attributes_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (attribute_id);
 D   ALTER TABLE ONLY public.attributes DROP CONSTRAINT attributes_pkey;
       public            postgres    false    229            �           2606    17210    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    231            �           2606    17151    customers customers_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_email_key;
       public            postgres    false    222            �           2606    17149    customers customers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);
 B   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_pkey;
       public            postgres    false    222            �           2606    17221    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    233            �           2606    17122    stores stores_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (store_id);
 <   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_pkey;
       public            postgres    false    215            �           2606    17176     subcategories subcategories_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (subcategory_id);
 J   ALTER TABLE ONLY public.subcategories DROP CONSTRAINT subcategories_pkey;
       public            postgres    false    226            �           2606    17124    superadmin superadmin_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_email_key UNIQUE (email);
 I   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_email_key;
       public            postgres    false    217            �           2606    17126    superadmin superadmin_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_pkey;
       public            postgres    false    217            �           2606    17128 3   vendors_registration vendors_registration_email_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.vendors_registration
    ADD CONSTRAINT vendors_registration_email_key UNIQUE (email);
 ]   ALTER TABLE ONLY public.vendors_registration DROP CONSTRAINT vendors_registration_email_key;
       public            postgres    false    219            �           2606    17130 .   vendors_registration vendors_registration_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.vendors_registration
    ADD CONSTRAINT vendors_registration_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.vendors_registration DROP CONSTRAINT vendors_registration_pkey;
       public            postgres    false    219            �           2606    17131 $   stores stores_added_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_added_by_admin_id_fkey FOREIGN KEY (added_by_admin_id) REFERENCES public.superadmin(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_added_by_admin_id_fkey;
       public          postgres    false    215    3510    217            �           2606    17136    stores stores_vendor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors_registration(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_vendor_id_fkey;
       public          postgres    false    3514    215    219            f   Q   x�3�άJ嬎��	�����	��VrvqV�Q*NL�B +�8�X)(�	�|K�S�3t�R�SsrR�*9��b���� ���      h   �   x�}��N1Dk�+�������u��� !�M��̥Hr��!Ŀs"�I�)�if�D�~�E(�}�����-(��a�	dKK�q��]-�>��$�.m����S��C�X�_ Ÿ������Ě������C.b�1Fp!괛r>��X��lW�h��7�� ���-��q��G Ҟ{~ҩ�S֯|�rk���8oVq      _   �  x�U�OR�0����;mMRڀ+�QFe uD]�6��m�i��k���x1�`
��7�E~��}o��8�1��AJ�� ����K
�s7�h�Y��N����tJ���A>:�!?d��GvM�ɀ���˝���_�*�D��Ǡ���'苘S`�+3�$S�2�3�.�AT�ZL���9� �F��P���8R��2�����9(����^��=kx�>�`N�����g��L��7{���޵���Os��m��`5[�/eO�+vV��R���eEF5ʩ�Z�0t��,%)�?���C*�~�;�F����Ҡ�7[��m��X�?�*�&�X?��k�~���@����I����i#�NB��l��7��X�'��묋Io���w�ƭ�h4~ ���`      j      x������ � �      X   �   x����
�0���S�.�Y��OA��]�T�nlR����Np�����_�Fe��9Z-_ӫ������}���&�{�
�B+cr&q1h�,�f0�����MTp��,��|�o�O��oxB��e�:����Qqi�\��ܶ|�����IDg��i��M�����\����[��eN,�h��oH�8�ڤ��F�z��,VZqL�m�      c   �   x�}M��0��S4����:�&�bH)_�Q
ia0�wFMn���qt4��@U�$LD!��dXȌ�,�4N�=K�YKu��ML�:�g�$&����X�&��:�^��S�Y������X&���EQy���t��ab�O��~n��ڪ֫�h�i�kg��vMb���ɾEQ      Z   �   x���;�0  й����2�1&��DC\�E(T�no<���#��U�A�U�! s>���[x� �q������'��lx��~��܃ƭ�eߤ��(�{�х�NhVn�0�2��|�\G���C�P�Qƶ��FV9�\��/�@�QUo�S>�lF�𘇱�0
�������;A��=v      \   �  x�e�]o� ����Enq c�}�l�Pe��t[�J����&5�Y��G�i�:���9���)�p`/�R��i��v`N��yr=�=�k�<\-�#]m���ס��٦ξ$��q���Ӹ�Ǹ!`R}e��N�
b�1��q�rw��2;Mi{hGߚ^A班���VxU��6^A)�]=ر�����3C�t�N�64�r'Uz;@Ӷ��A7al��3��f�j@�%����F1�9�@yjJ����X,�,_�͟x�t>u�A��BN�~��K��. �w:���=�9�SD��T�gy<x��/oi}�T]�_|�/6�nQ�=��o�/���O��c|�~����_'��"aEBb����p��I�|뱓o۰�k�b�@p�WF ��$x;=�Q�k{�>     