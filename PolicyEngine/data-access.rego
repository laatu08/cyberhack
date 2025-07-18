package data_access

default allow = false

# Budget app can access amount and date
allow if {
  input.appId == "budget-app"
  input.purpose == "budgeting"
  input.field == "balance"
}

allow if {
  input.appId == "budget-app"
  input.purpose == "budgeting"
  input.field == "date"
}

# Credit app can access pan and credit_score
allow if {
  input.appId == "credit-score-app"
  input.purpose == "credit scoring"
  input.field == "pan"
}

allow if {
  input.appId == "credit-score-app"
  input.purpose == "credit scoring"
  input.field == "credit_score"
}

allow if {
  input.appId == "z-pay-app"
  input.purpose == "payment"
  input.field == "balance"
}

allow if {
  input.appId == "z-pay-app"
  input.purpose == "payment"
  input.field == "accountNo"
}