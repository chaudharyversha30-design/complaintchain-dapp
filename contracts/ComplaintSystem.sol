// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ComplaintSystem {
    struct Complaint {
        uint256 id;
        string message;
        string category;
        address sender;
        uint256 timestamp;
        bool resolved;
    }

    address public admin;
    uint256 public complaintCount;
    Complaint[] private complaints;

    event ComplaintSubmitted(
        uint256 indexed id,
        string message,
        string category,
        address indexed sender,
        uint256 timestamp
    );
    event ComplaintResolved(uint256 indexed id, address indexed resolver);

    constructor(address _admin) {
        require(_admin != address(0), "Invalid admin address");
        admin = _admin;
    }

    function submitComplaint(string memory _message, string memory _category) public {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_category).length > 0, "Category cannot be empty");

        Complaint memory newComplaint = Complaint({
            id: complaintCount,
            message: _message,
            category: _category,
            sender: msg.sender,
            timestamp: block.timestamp,
            resolved: false
        });

        complaints.push(newComplaint);
        emit ComplaintSubmitted(
            newComplaint.id,
            newComplaint.message,
            newComplaint.category,
            newComplaint.sender,
            newComplaint.timestamp
        );
        complaintCount++;
    }

    function getAllComplaints() public view returns (Complaint[] memory) {
        return complaints;
    }

    function markAsResolved(uint256 _id) public {
        require(msg.sender == admin, "Only admin can resolve complaints");
        require(_id < complaints.length, "Complaint does not exist");
        require(!complaints[_id].resolved, "Complaint already resolved");

        complaints[_id].resolved = true;
        emit ComplaintResolved(_id, msg.sender);
    }
}
