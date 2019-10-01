# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all

u1 = User.create!(first_name: 'John', last_name: 'Doe', email_address: 'johndoe@email.com', password: 'password', funds: 10000)
u2 = User.create!(first_name: 'Jane', last_name: 'Doe', email_address: 'janedoe@email.com', password: 'password', funds: 50000)
u3 = User.create!(first_name: 'Mark', last_name: 'Lee', email_address: 'marklee@email.com', password: 'password', funds: 80000)
u4 = User.create!(first_name: 'Tony', last_name: 'Stark', email_address: 'tonystark@email.com', password: 'password', funds: 80000000)
u5 = User.create!(first_name: 'Bobby', last_name: 'Lee', email_address: 'bobbobby@email.com', password: 'password', funds: 80)